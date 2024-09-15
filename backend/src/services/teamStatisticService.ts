import { find } from 'lodash';
import { getTeamStatisticsBySeason } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { upsertTeamCard } from '../models/teamCard';
import { upsertTeamMatchOverview } from '../models/teamMatchOverview';
import { upsertTeamFormation } from '../models/teamFormation';
import { upsertTeamGoal } from '../models/teamGoal';
import { upsertTeamGoalMinute } from '../models/teamGoalMinute';
import { upsertTeamRecord } from '../models/teamRecord';
import { ResBiggest, ResCards, ResFixtures, ResGoals, ResLineup, ResPenalties, ResTeamStatistics } from '../types/apiObj/ResTeamStatistics';
import {
  HomeAway,
  TeamCard,
  TeamMatchOverview,
  MinuteRange,
  TeamGoal,
  ForAgainst,
  TeamGoalMinute,
  TeamFormation,
  TeamRecord
} from '../types/TeamStatistic';
import { percentageStringToNumber } from '../utils/Utils';
import { findTeamByApiId } from '../models/team';
import { findLeagueByApiId } from '../models/league';

const homeAwayValues: HomeAway[] = ['home', 'away', 'total'];
const forAgainstValues: ForAgainst[] = ['for', 'against'];
const minuteRangeValues: MinuteRange[] = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '91-105', '106-120'];

export const fetchTeamStatistics = async (leagueId: number, teamId: number, season: number) => {
  try {
    const resStatistics = await getTeamStatisticsBySeason({ leagueId, teamId, season });
    const statistic: ResTeamStatistics = resStatistics.response;
    const {
      league,
      team,
      cards,
      fixtures,
      goals,
      lineups,
      form,
      biggest,
      clean_sheet: cleanSheet,
      failed_to_score: failedToScore,
      penalty
    } = statistic;
    const leagueApiId = league.id;
    const teamApiId = team.id;
    logger.info(`Syncing team statistics for team: ${team.name} and league: ${league.name}`);

    if (!leagueApiId || !teamApiId) throw new Error('Team ID or League ID is null');
    const dbLeague = await findLeagueByApiId(leagueApiId);
    const dbTeam = await findTeamByApiId(teamApiId);
    if (!dbLeague || !dbTeam || !dbLeague.id || !dbTeam.id) throw new Error('Team or League not found');
    // Team Cards
    await convertCardsResponseToTeamCards(cards, dbTeam.id, dbLeague.id, season);
    // Team Fixtures
    await convertFixturesResponseToTeamMatchOverviews(fixtures, dbTeam.id, dbLeague.id, season);
    // Team goals
    await convertGoalsResponseToTeamGoals(goals, dbTeam.id, dbLeague.id, season);
    // Team Formations
    await convertFormationsResponseToTeamFormations(lineups, dbTeam.id, dbLeague.id, season);
    // Team Record
    await convertResponseToTeamRecords(form, biggest, cleanSheet, failedToScore, penalty, dbTeam.id, dbLeague.id, season);
  } catch (error) {
    throw new Error('Failed to fetch team statistics');
  }
};

const convertCardsResponseToTeamCards = (cards: ResCards, statTeamId: number, statLeagueId: number, season: number) => {
  const { yellow, red } = cards;
  for (const minute of minuteRangeValues) {
    const yellowCard = yellow[minute as MinuteRange];
    const redCard = red[minute as MinuteRange];
    const teamCard = {
      teamId: statTeamId,
      leagueId: statLeagueId,
      yearNum: season,
      minute: minute,
      yellowTotal: yellowCard.total,
      yellowPercentage: percentageStringToNumber(yellowCard.percentage),
      redTotal: redCard.total,
      redPercentage: percentageStringToNumber(redCard.percentage)
    } as TeamCard;

    upsertTeamCard(teamCard);
  }
};

const convertFixturesResponseToTeamMatchOverviews = (fixtures: ResFixtures, statTeamId: number, statLeagueId: number, season: number) => {
  const homeTeamMatchOverview: TeamMatchOverview = {
    teamId: statTeamId,
    leagueId: statLeagueId,
    yearNum: season,
    homeAway: 'home',
    played: fixtures.played.home,
    wins: fixtures.wins.home,
    draws: fixtures.draws.home,
    loses: fixtures.loses.home
  };

  const awayTeamMatchOverview: TeamMatchOverview = {
    teamId: statTeamId,
    leagueId: statLeagueId,
    yearNum: season,
    homeAway: 'away',
    played: fixtures.played.away,
    wins: fixtures.wins.away,
    draws: fixtures.draws.away,
    loses: fixtures.loses.away
  };

  const totalTeamMatchOverview: TeamMatchOverview = {
    teamId: statTeamId,
    leagueId: statLeagueId,
    yearNum: season,
    homeAway: 'total',
    played: fixtures.played.total,
    wins: fixtures.wins.total,
    draws: fixtures.draws.total,
    loses: fixtures.loses.total
  };

  return Promise.all([
    upsertTeamMatchOverview(homeTeamMatchOverview),
    upsertTeamMatchOverview(awayTeamMatchOverview),
    upsertTeamMatchOverview(totalTeamMatchOverview)
  ]);
};

const convertGoalsResponseToTeamGoals = (goals: ResGoals, statTeamId: number, statLeagueId: number, season: number) => {
  forAgainstValues.forEach(forAgainst => {
    const goalsInner = goals[forAgainst];

    homeAwayValues.forEach(homeAway => {
      const goalRecord = {
        teamId: statTeamId,
        leagueId: statLeagueId,
        yearNum: season,
        homeAway,
        forAgainst,
        total: goalsInner.total[homeAway],
        average: parseFloat(goalsInner.average[homeAway])
      } as TeamGoal;
      upsertTeamGoal(goalRecord);
    });

    minuteRangeValues.forEach(minute => {
      const goalMinuteRecord = {
        teamId: statTeamId,
        leagueId: statLeagueId,
        yearNum: season,
        forAgainst,
        minute,
        total: goalsInner.minute[minute].total,
        percentage: percentageStringToNumber(goalsInner.minute[minute].percentage)
      } as TeamGoalMinute;
      upsertTeamGoalMinute(goalMinuteRecord);
    });
  });
};

const convertFormationsResponseToTeamFormations = (formations: ResLineup[], statTeamId: number, statLeagueId: number, season: number) => {
  formations.forEach(formation => {
    const formationRecord = {
      teamId: statTeamId,
      leagueId: statLeagueId,
      yearNum: season,
      formation: formation.formation,
      played: formation.played
    } as TeamFormation;
    upsertTeamFormation(formationRecord);
  });
};

const convertResponseToTeamRecords = (
  form: string,
  biggest: ResBiggest,
  cleanSheet: Record<HomeAway, number>,
  failedToScore: Record<HomeAway, number>,
  penalty: ResPenalties,
  statTeamId: number,
  statLeagueId: number,
  season: number
) => {
  const teamRecord = {
    teamId: statTeamId,
    leagueId: statLeagueId,
    yearNum: season,
    form,
    streakWins: biggest.streak.wins,
    streakDraws: biggest.streak.draws,
    streakLoses: biggest.streak.loses,
    winsHome: biggest.wins.home,
    winsAway: biggest.wins.away,
    losesHome: biggest.loses.home,
    losesAway: biggest.loses.away,
    biggestForHome: biggest.goals.for.home,
    biggestForAway: biggest.goals.for.away,
    biggestAgainstHome: biggest.goals.against.home,
    biggestAgainstAway: biggest.goals.against.away,
    cleanSheetHome: cleanSheet.home,
    cleanSheetAway: cleanSheet.away,
    cleanSheetTotal: cleanSheet.total,
    failedToScoreHome: failedToScore.home,
    failedToScoreAway: failedToScore.away,
    failedToScoreTotal: failedToScore.total,
    penaltyTotal: penalty.total,
    penaltyScoredTotal: penalty.scored.total,
    penaltyScoredPercentage: percentageStringToNumber(penalty.scored.percentage),
    penaltyMissedTotal: penalty.missed.total,
    penaltyMissedPercentage: percentageStringToNumber(penalty.missed.percentage)
  } as TeamRecord;

  upsertTeamRecord(teamRecord);
};
