let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Statistics", () => {
  describe("/GET statistics", () => {
    it("it should GET statistics for all profiles", (done) => {
      chai
        .request(server)
        .get("/api/v1/statistics")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.payload.should.be.a("array");
          res.body.message.should.be.eql("Statistics successfully calculated!");
          res.body.payload[0].All.mean.should.be.eql(22295010);
          res.body.payload[0].All.min.should.be.eql(30);
          res.body.payload[0].All.max.should.be.eql(200000000);
          done();
        });
    });

    it("it should GET statistics of contracted profiles", (done) => {
      chai
        .request(server)
        .get("/api/v1/statistics?onContract=true")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.payload.should.be.a("array");
          res.body.message.should.be.eql("Statistics successfully calculated!");
          res.body.payload[0].All.mean.should.be.eql(100000);
          res.body.payload[0].All.min.should.be.eql(90000);
          res.body.payload[0].All.max.should.be.eql(110000);
          done();
        });
    });

    it("it should GET statistics by department", (done) => {
      chai
        .request(server)
        .get("/api/v1/statistics?byDepartment=true")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.payload.should.be.a("array");
          res.body.message.should.be.eql("Statistics successfully calculated!");
          res.body.payload.length.should.be.eql(4);
          res.body.payload[0].should.have.nested.property("Engineering");
          res.body.payload[1].should.have.nested.property("Banking");
          res.body.payload[2].should.have.nested.property("Operations");
          res.body.payload[3].should.have.nested.property("Administration");
          done();
        });
    });

    it("it should GET statistics by sub-department", (done) => {
      chai
        .request(server)
        .get("/api/v1/statistics?bySubDepartment=true")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.payload.should.be.a("array");
          res.body.message.should.be.eql("Statistics successfully calculated!");
          res.body.payload.length.should.be.eql(4);
          res.body.payload[0].should.have.nested.property("Engineering");
          res.body.payload[0].Engineering[0].should.have.nested.property(
            "Platform"
          );
          res.body.payload[1].should.have.nested.property("Banking");
          res.body.payload[1].Banking[0].should.have.nested.property("Loan");
          res.body.payload[2].should.have.nested.property("Operations");
          res.body.payload[2].Operations[0].should.have.nested.property(
            "CustomerOnboarding"
          );
          res.body.payload[3].should.have.nested.property("Administration");
          res.body.payload[3].Administration[0].should.have.nested.property(
            "Agriculture"
          );
          done();
        });
    });
  });
});
