import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Get the file path from the URL search params
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');
    
    console.log('📁 API route called with file:', filePath);
    
    if (!filePath) {
      console.log('❌ No file parameter provided');
      return new NextResponse('File parameter is required', { status: 400 });
    }

    // Security check to prevent directory traversal
    if (filePath.includes('..') || filePath.startsWith('/')) {
      console.log('❌ Invalid file path:', filePath);
      return new NextResponse('Invalid file path', { status: 400 });
    }

    // Construct the full file path
    const fullPath = join(process.cwd(), 'public', 'steps', filePath);
    console.log('🔍 Trying to read file from:', fullPath);
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      console.log('❌ File does not exist:', fullPath);
      return new NextResponse(`File not found: ${filePath}`, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Read the file content
    const content = await readFile(fullPath, 'utf8');
    console.log('✅ File read successfully, content length:', content.length);
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('❌ Error reading step file:', error);
    return new NextResponse(`Server error: ${error.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}