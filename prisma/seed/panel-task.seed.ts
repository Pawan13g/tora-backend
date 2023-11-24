import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {

    const links = [
        { "link": "https://www.adventuregearhub.com/products/hiking-boots" },
        { "link": "https://www.localartisanmarketplace.com/handcrafted-furniture" },
        { "link": "https://www.scientificdiscoveriesjournal.org/latest-research" },
        { "link": "https://www.petwellnesscommunity.net/forums/nutrition" },
        { "link": "https://www.localmusiciannetwork.com/events/open-mic-night" },
        { "link": "https://www.culinaryadventuresblog.net/recipes/fusion-cuisine" },
        { "link": "https://www.sustainablelivingforum.org/discussions/zero-waste-tips" },
        { "link": "https://www.urbanexplorersguidebook.com/offbeat-destinations" },
        { "link": "https://www.historicalcollectiblesauction.com/ancient-artifacts" },
        { "link": "https://www.techtinkerersforum.net/diy-projects/electronics" }
    ]

    const fakerRounds = 50;
    dotenv.config();
    console.log('Seeding db...');
    /// --------- Panel Tasks ---------------
    for (let i = 0; i < fakerRounds; i++) {
        await prisma.panelTask.create({
            data: {
                name: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
                amount: faker.number.int({ min: 3, max: 50 }).toString(),
                t_link: faker.helpers.arrayElement(links).link,
                kpi: faker.lorem.words(faker.number.int({ min: 1, max: 4 }))
            }
        });
    }
};



main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });