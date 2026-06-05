import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter }).$extends({
    result: {
      inventory: {
        currentValue: {
          // Specify the dependencies needed to calculate currentValue
          needs: { purchaseDate: true, price: true, salvageValue: true, itemId: true },
          compute(inventory) {
            // NOTE: To fully compute this synchronously in the Prisma extension, 
            // we would ideally need 'usefulLifeMonths' from the related Item.
            // Since computed fields currently only have access to the model's own fields,
            // we'll provide a base calculation method here, or we can resolve it in the service layer.
            
            // For now, this is a placeholder. True real-time depreciation relying on a relation 
            // is best handled in a dedicated Service function where we explicitly `include: { item: true }`.
            return inventory.price; // Placeholder
          },
        },
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
