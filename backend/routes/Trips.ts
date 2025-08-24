import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import TripPlan, { ITripPlan } from '../models/TripPlan';

const createTripSchema = z.object({
  title: z.string().min(1).max(100),
  destination: z.string().min(1).max(100),
  days: z.number().min(1).max(365),
  budget: z.number().min(0)
});

const updateTripSchema = createTripSchema.partial();
const idParamSchema = z.object({ id: z.string() });

type CreateTripRequest = FastifyRequest<{
  Body: z.infer<typeof createTripSchema>;
}>;

type UpdateTripRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>;
  Body: z.infer<typeof updateTripSchema>;
}>;

type GetTripRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>;
}>;

type GetTripsRequest = FastifyRequest<{
  Querystring: {
    page?: string;
    limit?: string;
    search?: string;
    minBudget?: string;
    maxBudget?: string;
  };
}>;

export async function tripRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: GetTripsRequest, reply: FastifyReply) => {
    try {
      const page = parseInt(request.query.page || '1');
      const limit = parseInt(request.query.limit || '10');
      const skip = (page - 1) * limit;
      
      const filter: any = {};
      
      if (request.query.search) {
        filter.$or = [
          { title: { $regex: request.query.search, $options: 'i' } },
          { destination: { $regex: request.query.search, $options: 'i' } }
        ];
      }
      
      if (request.query.minBudget || request.query.maxBudget) {
        filter.budget = {};
        if (request.query.minBudget) {
          filter.budget.$gte = parseInt(request.query.minBudget);
        }
        if (request.query.maxBudget) {
          filter.budget.$lte = parseInt(request.query.maxBudget);
        }
      }
      
      const trips = await TripPlan.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await TripPlan.countDocuments(filter);
      
      return {
        trips,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch trips' });
    }
  });

  fastify.get('/:id', async (request: GetTripRequest, reply: FastifyReply) => {
    try {
      const { id } = idParamSchema.parse(request.params);
      const trip = await TripPlan.findById(id);
      
      if (!trip) {
        return reply.status(404).send({ error: 'Trip not found' });
      }
      
      return trip;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid ID format' });
      }
      reply.status(500).send({ error: 'Failed to fetch trip' });
    }
  });

  fastify.post('/', async (request: CreateTripRequest, reply: FastifyReply) => {
    try {
      const validatedData = createTripSchema.parse(request.body);
      const trip = new TripPlan(validatedData);
      await trip.save();
      
      reply.status(201).send(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues });
      }
      reply.status(500).send({ error: 'Failed to create trip' });
    }
  });

  fastify.put('/:id', async (request: UpdateTripRequest, reply: FastifyReply) => {
    try {
      const { id } = idParamSchema.parse(request.params);
      const validatedData = updateTripSchema.parse(request.body);
      
      const trip = await TripPlan.findByIdAndUpdate(
        id,
        validatedData,
        { new: true, runValidators: true }
      );
      
      if (!trip) {
        return reply.status(404).send({ error: 'Trip not found' });
      }
      
      return trip;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.issues });
      }
      reply.status(500).send({ error: 'Failed to update trip' });
    }
  });
}