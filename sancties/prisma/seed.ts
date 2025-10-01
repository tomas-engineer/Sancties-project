import { PrismaClient } from '../app/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing existing data...')

  // verwijder alle vorige data
  await prisma.straffen.deleteMany({})
  await prisma.leerling.deleteMany({})
  await prisma.sanctie.deleteMany({})

  console.log('Database cleared!')
  console.log('Seeding fresh data...')

  // Niveau 1 - Lichte straffen
  const sanctie1 = await prisma.sanctie.create({
    data: {
      naam: 'Nablijven 10 minuten',
      niveau: 1
    }
  })

  const sanctie2 = await prisma.sanctie.create({
    data: {
      naam: 'Bord schoonmaken',
      niveau: 1
    }
  })

  const sanctie3 = await prisma.sanctie.create({
    data: {
      naam: 'Excuusbrief schrijven',
      niveau: 1
    }
  })

  // Niveau 2 - Middel straffen
  const sanctie4 = await prisma.sanctie.create({
    data: {
      naam: 'Nablijven 30 minuten',
      niveau: 2
    }
  })

  const sanctie5 = await prisma.sanctie.create({
    data: {
      naam: 'Telefoon inleveren',
      niveau: 2
    }
  })

  const sanctie6 = await prisma.sanctie.create({
    data: {
      naam: 'Rapport naar ouders',
      niveau: 2
    }
  })

  // Niveau 3 - Zware straffen
  const sanctie7 = await prisma.sanctie.create({
    data: {
      naam: 'Schorsing 1 dag',
      niveau: 3
    }
  })

  const sanctie8 = await prisma.sanctie.create({
    data: {
      naam: 'Ouders gesprek',
      niveau: 3
    }
  })

  // Maak leerlingen aan
  const leerling1 = await prisma.leerling.create({
    data: {
      naam: 'Bram Krikke'
    }
  })

  const leerling2 = await prisma.leerling.create({
    data: {
      naam: 'Kiki Jansen'
    }
  })

  const leerling3 = await prisma.leerling.create({
    data: {
      naam: 'Tim Holledeer'
    }
  })

  const leerling4 = await prisma.leerling.create({
    data: {
      naam: 'Djomar Lopulissa'
    }
  })

  const leerling5 = await prisma.leerling.create({
    data: {
      naam: 'Tomas Heij'
    }
  })

  // Koppel sancties aan leerlingen
  await prisma.straffen.createMany({
    data: [
      // Bram Krikke - chagrijnig
      { leerlingId: leerling1.id, sanctieId: sanctie1.id }, // nablijven 10 min
      { leerlingId: leerling1.id, sanctieId: sanctie3.id }, // excuusbrief

      // Kiki Jansen - praat te veel
      { leerlingId: leerling2.id, sanctieId: sanctie1.id }, // nablijven
      { leerlingId: leerling2.id, sanctieId: sanctie4.id }, // nablijven 30 min
      { leerlingId: leerling2.id, sanctieId: sanctie6.id }, // rapport ouders

      // Tim Holledeer - te laat
      { leerlingId: leerling3.id, sanctieId: sanctie2.id }, // bord schoonmaken
      { leerlingId: leerling3.id, sanctieId: sanctie4.id }, // nablijven 30 min

      // Ridiouan Taghi - telefoon
      { leerlingId: leerling4.id, sanctieId: sanctie5.id }, // telefoon inleveren
      { leerlingId: leerling4.id, sanctieId: sanctie7.id }, // schorsing 1 dag
      { leerlingId: leerling4.id, sanctieId: sanctie8.id }, // ouders gesprek

      // Tomas Heij - lawaaierig
      { leerlingId: leerling5.id, sanctieId: sanctie6.id }, // rapport ouders
      { leerlingId: leerling5.id, sanctieId: sanctie7.id }, // schorsing 1 dag
    ]
  })

  console.log('Database seeded with fresh data!')
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