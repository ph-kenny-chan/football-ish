import React from 'react';
import Header from './components/header/Header';
import Card from './components/Card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Header className='z-10 max-w-5xl w-full flex items-center justify-between' />
      <div className="z-10 max-w-6xl flex justify-between w-full mt-8">
        <Card className="w-20% bg-gray-200 mr-4">Left Column</Card>
        <Card className="w-60% bg-gray-300 mx-4">Middle Column</Card>
        <Card className="w-20% bg-gray-200 ml-4">Right Column</Card>
      </div>
    </main>
  );
}
