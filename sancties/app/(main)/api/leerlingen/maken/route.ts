// app/api/leerlingen/ophalen/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leerlingen = await prisma.leerling.findMany({
      include: {
        straffen: {
          include: {
            sanctie: true
          }
        }
      },
      orderBy: {
        naam: 'asc'
      }
    })
    
    return NextResponse.json(leerlingen)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leerlingen' },
      { status: 500 }
    )
  }
}