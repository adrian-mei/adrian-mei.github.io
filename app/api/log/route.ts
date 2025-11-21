import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level, msg, timestamp, ...data } = body;

    // Format the log for the server terminal
    // We use console.log/error so it shows up in the terminal where `npm run dev` is running
    const logFn = level === 'error' ? console.error : console.log;
    
    // Add a prefix to distinguish client logs
    const prefix = `[CLIENT] [${level.toUpperCase()}]`;
    
    // Print the main message
    logFn(`${prefix} ${msg}`);
    
    // If there is additional data, print it nicely
    if (Object.keys(data).length > 0) {
      logFn(`${prefix} Data:`, JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process client log:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
