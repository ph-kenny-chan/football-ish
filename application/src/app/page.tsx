import React from 'react';
import Header from './components/header/Header';
import Card from './components/Card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Header className='z-10 max-w-5xl w-full flex items-center justify-between' />
      <div className="z-10 max-w-6xl flex justify-between w-full mt-8">
        <Card className="container">left</Card>
        <Card className="container">middle</Card>
        <Card className="container">right</Card>
      </div>
    </main>
  );
}
