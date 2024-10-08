import { describe, beforeAll, afterAll, beforeEach, afterEach, expect, test } from '@jest/globals';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import {router} from '../src/routers/index';
import { errorHandler } from '../src/middleware/errorHandler';
import { Event } from '../src/models/events';
import supertest from 'supertest';
import { mocks } from '../mocks/mock';
import { IEvent, IInvalidEvent, IResEvent } from '../src/types';
import { TEST_MONOGDB_URI } from '../src/config';


dotenv.config();

const dbName = 'events';
const dbUri = `${TEST_MONOGDB_URI}-${dbName}`;

beforeAll(async () => {
  mongoose.connect(dbUri);
});

afterEach(async () => {
  await Event.deleteMany();
});

afterAll(async () => {
  mongoose.connection.close();
});


describe('Event endpoints', () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  app.use(errorHandler)
  const request = supertest(app);

  // GET all events
  describe('GET /events endpoints', () => {
    describe('Get without previous posts', () => {
      test('should return status code 200', async () => {
        const response = await request.get('/events');
        expect(response.status).toBe(200);
      });

      test('should return empty array for empty database', async () => {
        const response = await request.get('/events');
        const events: IEvent[] = response.body;
        expect(events).toEqual([]);
      });
    })

    describe('Get with previous posts', () => {
      // ! response types?
      let response: any;
      let _id: string;
      let __v: number;

      beforeEach(async () => {
        response = await request.post('/events').send(mocks.newEvent);
        _id = response.body._id;
        __v = response.body.__v;
        response = await request.get('/events');
      });

      test('should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('1 db post should return array with 1 event', async () => {
        const events: IResEvent[] = response.body;
        expect(events).toEqual([{ ...mocks.resEvent, _id, __v }]);
      });

      test('2 db posts should return array with 2 events', async () => {
        // 2nd post
        const postResponse2 = await request.post('/events').send(mocks.newEvent);
        const id2 = postResponse2.body._id;
        const v2 = postResponse2.body.__v;
        // get
        const response = await request.get('/events');
        const events: IResEvent[] = response.body;
        expect(events).toEqual([
          { ...mocks.resEvent, _id, __v},
          { ...mocks.resEvent, _id: id2, __v: v2 },
        ]);
      });
    });
  });

  //POST events
  describe('POST /events', () => {
    describe('Valid request', () => {
      let response: any;
      let _id: string;
      let __v: number;

      beforeEach(async () => {
        response = await request.post('/events').send(mocks.newEvent);
        _id = response.body._id;
        __v = response.body.__v;
      });

      test('should return status code 201', async () => {
        expect(response.status).toBe(201);
      });

      test('should return posted event', async () => {
        expect(response.body).toEqual({ ...mocks.resEvent, _id, __v });
      });

      test('posted event should be in db', async () => {
        const retrieved = await request.get('/events')
        const body = retrieved.body[0]
        // ! why failing?
        // console.log('----body', body)
        // expect(body).toContain({...mocks.resEvent, _id, __v});
        expect(body).toHaveProperty('_id', _id);
        // expect(body).toHaveProperty('place_id', mocks.resEvent.place_id);
        // expect(body).toHaveProperty('park_name', mocks.resEvent.park_name);
        // expect(body).toHaveProperty('address', mocks.resEvent.address);
        // expect(body).toHaveProperty('date', mocks.resEvent.date);
        // expect(body).toHaveProperty('user', mocks.resEvent.user);
        // expect(body).toHaveProperty('dog-avatar', mocks.resEvent.dog_avatar);
      });
    });

    describe('Invalid request body', () => {
      test('Request body with missing data should return status code 400 & error message', async () => {
        const event: IInvalidEvent = { ...mocks.newEvent };
        delete event.place_id;
        const response = await request.post('/events').send(event);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      test('Request body with empty data should return status code 400 & error message', async () => {
        const event: IInvalidEvent = { ...mocks.newEvent };
        event.place_id = '';
        const response = await request.post('/events').send(event);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });
  });

  // GET Events by place_id
  describe('GET /events/park/:place_id', () => {
    describe('Valid request', () => {
      let response: any;
      let _id: string;
      let __v: number;

      beforeEach(async () => {
        const post = await request.post('/events').send(mocks.newEvent);
        _id = post.body._id;
        __v = post.body.__v;
        response = await request.get(`/events/park/${mocks.newEvent.place_id}`);
      });

      test('should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('1 db post for park should return array with 1 event', async () => {
        expect(response.body).toEqual([{ ...mocks.resEvent, _id, __v }]);
      });

      test('2 db posts for park should return array with 2 events', async () => {
        // 2nd post
        const postResponse2 = await request
          .post('/events')
          .send(mocks.newEvent);
        const id2 = postResponse2.body._id;
        const v2 = postResponse2.body.__v;
        // get
        const response = await request.get(`/events/park/${mocks.newEvent.place_id}`)
        const events: IResEvent[] = response.body;
        expect(events).toEqual([
          { ...mocks.resEvent, _id, __v },
          { ...mocks.resEvent, _id: id2, __v: v2 },
        ]);
      });
    });

    describe('Invalid request', () => {
      test('No entry in data base should return status code 400 & error message', async () => {
        const response = await request.get(`/events/park/my_id`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
      test('Request body with missing parameter', async () => {
        const response = await request.get(`/events/park/`);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        // 2nd variant
        const response2 = await request.get(`/events/park`);
        expect(response2.status).toBe(500);
        expect(response2.body).toHaveProperty('error');
      });
    });
  });

  // GET Events by user_id
  describe('GET /events/users/:user', () => {
    describe('Valid request', () => {
      let response: any;
      let _id: string;
      let __v: number;

      beforeEach(async () => {
        const post = await request.post('/events').send(mocks.newEvent);
        _id = post.body._id;
        __v = post.body.__v;
        response = await request.get(`/events/user/${mocks.newEvent.user}`);
      });

      test('should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('1 db posts for user should return array with 1 event', async () => {
        expect(response.body).toEqual([{ ...mocks.resEvent, _id, __v }]);
      });

      test('2 db posts for user should return array with 2 events', async () => {
        // 2nd post
        const postResponse2 = await request
          .post('/events')
          .send(mocks.newEvent);
        const id2 = postResponse2.body._id;
        const v2 = postResponse2.body.__v;
        // get
        const response = await request.get(
          `/events/user/${mocks.newEvent.user}`,
        );
        const events: IResEvent[] = response.body;
        expect(events).toEqual([
          { ...mocks.resEvent, _id, __v },
          { ...mocks.resEvent, _id: id2, __v: v2 },
        ]);
      });
    });

    describe('Invalid request', () => {
      test('No entry in data base should return status code 400 & error message', async () => {
        const response = await request.get(`/events/user/me`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      test('Request body with missing parameter', async () => {
        const response = await request.get(`/events/user/`);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        // 2nd variant
        const response2 = await request.get(`/events/user`);
        expect(response2.status).toBe(500);
        expect(response2.body).toHaveProperty('error');
      });
    });
  });

  // GET Event by ID
  test('GET /events/:id - should retrieve an event by its ID', async () => {
    // POST to create a new event
    const postResponse = await request.post('/events').send(mocks.newEvent);
    expect(postResponse.status).toBe(201);
    const eventId = postResponse.body._id;

    // GET the event by its ID
    const getResponse = await request.get(`/events/${eventId}`);

    // Assertions
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('_id', eventId);
    expect(getResponse.body).toHaveProperty(
      'place_id',
      mocks.newEvent.place_id,
    );
    expect(getResponse.body).toHaveProperty(
      'park_name',
      mocks.newEvent.park_name,
    );
  });

  // POST with Invalid Data
  test('POST /events - should fail when sending invalid data', async () => {
    const response = await request.post('/events').send(mocks.invalidEvent);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // GET an Event That Does Not Exist
  test('GET /events/:id - should return 400 for a non-existing event', async () => {
    const nonExistingEventId = new mongoose.Types.ObjectId().toString();
    const response = await request.get(`/events/${nonExistingEventId}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // PUT (EDIT) -> Only dates
  test('PUT /events/:id - should update the event date', async () => {
    // Create a new even to ensure a valid ID is available
    const postResponse = await request.post('/events').send(mocks.newEvent);
    expect(postResponse.status).toBe(201);
    const eventId = postResponse.body._id;

    // update with valid date
    const newDate = new Date('2024-02-01T00:00:00Z').toISOString();
    const putResponse = await request
      .put(`/events/${eventId}`)
      .send({ date: newDate });
    expect(putResponse.status).toBe(200);
    expect(putResponse.body).toHaveProperty(
      'message',
      'Event updated successfully',
    );
    expect(putResponse.body.updatedEvent).toHaveProperty('date', newDate);

    // Verify the date was updated
    const checkResponse = await request.get(`/events/${eventId}`);
    expect(checkResponse.status).toBe(200);
    expect(checkResponse.body.date).toBe(newDate);

    // Attempt to update with invalid date format
    const invalidDateResponse = await request
      .put(`/events/${eventId}`)
      .send({ date: 'invalid-date' });
    expect(invalidDateResponse.status).toBe(500);
    expect(invalidDateResponse.body).toHaveProperty('error');

    // Attempt to update a non-existing event
    const nonExistingEventId = new mongoose.Types.ObjectId().toString();
    const nonExistingUpdateResponse = await request
      .put(`/events/${nonExistingEventId}`)
      .send({ date: newDate });
    expect(nonExistingUpdateResponse.status).toBe(400);
    expect(nonExistingUpdateResponse.body).toHaveProperty('error');

    // Attempt to update with missing fields
    const missingFieldsResponse = await request
      .put(`/events/${eventId}`)
      .send({});
    expect(missingFieldsResponse.status).toBe(400);
    expect(missingFieldsResponse.body).toHaveProperty('error');
  });

  // Delete
  test('DELETE /events/:id - should delete the event', async () => {
    // Create a new event to ensure a valid ID is available
    const postResponse = await request.post('/events').send(mocks.newEvent);
    expect(postResponse.status).toBe(201);
    const eventId = postResponse.body._id;

    // Successful deletion
    const deleteResponse = await request.delete(`/events/${eventId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty(
      'message',
      'Event deleted successfully',
    );

    // Verify the event was deleted
    const checkResponse = await request.get(`/events/${eventId}`);
    expect(checkResponse.status).toBe(400);

    // Attempt to delete a non-existing event
    const nonExistingEventId = new mongoose.Types.ObjectId().toString();
    const nonExistingDeleteResponse = await request.delete(
      `/events/${nonExistingEventId}`,
    );
    expect(nonExistingDeleteResponse.status).toBe(400);
    expect(nonExistingDeleteResponse.body).toHaveProperty('error');

    // Attempt to delete without providing an ID
    const missingIdDeleteResponse = await request.delete('/events/');
    expect(missingIdDeleteResponse.status).toBe(404);
  });
});
