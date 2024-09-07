select * from country c 
	inner join league l on c.id = l.country_id 
	where l.type = 'League' and c.code IN ('ES') limit 3;

select * from team where country = 'Spain';
select * from venue;
select * from team_venue;