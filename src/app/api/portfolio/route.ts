import { NextResponse } from 'next/server';
import { getEnrichedPortfolio } from '../../../services/portfolioService';
import portfolioData from '../../../data/portfolio.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getEnrichedPortfolio(portfolioData);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
