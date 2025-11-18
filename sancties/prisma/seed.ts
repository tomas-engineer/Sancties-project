import { PrismaClient } from '../app/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Clearing existing data...')

  // Wis alle data in de juiste volgorde (vanwege foreign keys)
  await prisma.straffen.deleteMany({})
  await prisma.leerling.deleteMany({})
  await prisma.sanctie.deleteMany({})

  console.log('✅ Database cleared!')
  console.log('🌱 Seeding fresh data...')

  // Niveau 1 - Lichte straffen
  const sanctie1 = await prisma.sanctie.create({
    data: {
      naam: 'Bord vegen',
      niveau: 1
    }
  })

  const sanctie2 = await prisma.sanctie.create({
    data: {
      naam: 'Koffie halen',
      niveau: 1
    }
  })

  const sanctie3 = await prisma.sanctie.create({
    data: {
      naam: 'Snoep kopen',
      niveau: 1
    }
  })

  // Niveau 2 - Middel straffen
  const sanctie4 = await prisma.sanctie.create({
    data: {
      naam: 'Nablijven',
      niveau: 2
    }
  })

  // Maak leerlingen aan
  const leerling1 = await prisma.leerling.create({
    data: {
      naam: 'Peter'
    }
  })

  const leerling2 = await prisma.leerling.create({
    data: {
      naam: 'Gerard'
    }
  })

  // Koppel sancties aan leerlingen
  await prisma.straffen.createMany({
    data: [
      // Peter krijgt: Bord vegen, Koffie halen, Snoep kopen, Nablijven
      { leerlingId: leerling1.id, sanctieId: sanctie1.id },
      { leerlingId: leerling1.id, sanctieId: sanctie2.id },
      { leerlingId: leerling1.id, sanctieId: sanctie3.id },
      { leerlingId: leerling1.id, sanctieId: sanctie4.id },

      // Gerard krijgt: Nablijven, Snoep kopen
      { leerlingId: leerling2.id, sanctieId: sanctie4.id },
      { leerlingId: leerling2.id, sanctieId: sanctie3.id },
    ]
  })

  console.log('✅ Database seeded with fresh data!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })