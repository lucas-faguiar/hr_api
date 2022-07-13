let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Profiles", () => {
  let profile = {
    name: "John Doe",
    salary: "1",
    currency: "USD",
    department: "Engineering",
    sub_department: "Service",
  };

  describe("/GET profile", () => {
    it("it should GET all the profiles", (done) => {
      chai
        .request(server)
        .get("/api/v1/profiles")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(9);
          done();
        });
    });
  });

  describe("/POST profile", () => {
    it("it should not POST a profile with wrong misssing parameter", (done) => {
      chai
        .request(server)
        .post("/api/v1/profiles")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.payload[0].message.should.be.eql(
            "must have required property 'name'"
          );
          done();
        });
    });

    it("it should not POST a profile with wrong parameter type", (done) => {
      profile.salary = 1;
      chai
        .request(server)
        .post("/api/v1/profiles")
        .send(profile)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.payload[0].message.should.be.eql("must be string");
          done();
        });
    });

    it("it should POST and save a valid profile", (done) => {
      profile.salary = "1";
      chai
        .request(server)
        .post("/api/v1/profiles")
        .send(profile)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.message.should.be.eql("Profile successfully created!");
          done();
        });
    });

    it("it should not POST a profile with existing name", (done) => {
      chai
        .request(server)
        .post("/api/v1/profiles")
        .send(profile)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.message.should.be.eql(
            "Profile with this name already exists..."
          );
          done();
        });
    });
  });

  describe("/DELETE profile by name", () => {
    it("it should DELETE an existing profile by name", (done) => {
      chai
        .request(server)
        .delete(`/api/v1/profiles/${profile.name}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eql("Profile successfully deleted!");
          done();
        });
    });

    it("it should not DELETE a non-existing profile", (done) => {
      chai
        .request(server)
        .delete(`/api/v1/profiles/dummy_name}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.be.eql("Profile not found");
          done();
        });
    });
  });
});
