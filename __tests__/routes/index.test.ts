import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/app";
import { User } from "@prisma/client";

describe("GET /", () => {
  let testUser: User;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        name: "Test User",
        lineId: "test",
      },
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });

  it("should return 200 OK", (done) => {
    request(app).get("/").expect(200, done);
  });

  describe("GET /users", () => {
    it("should return 200 OK", (done) => {
      request(app).get("/users").expect(200, done);
    });
  });

  describe("GET /users/1/messages", () => {
    it("should return 200 OK", (done) => {
      request(app).get(`/users/${testUser.id}/messages`).expect(200, done);
    });
  });

  describe("GET /users/1/condition", () => {
    it("should return 200 OK", (done) => {
      request(app).get(`/users/${testUser.id}/condition`).expect(200, done);
    });
  });
});
