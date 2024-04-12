describe("Parties should work correctly", () => {
  before(() => {
    cy.visit("http://localhost:3000");
  })

  it("should not display broker information field when no broker is selected", () => {
    cy.get("#managing-broker-address").should("not.exist");
    cy.get("#managing-broker-country").should("not.exist");
    cy.get("#managing-broker-contact").should("not.exist");
    cy.get("#managing-broker-commission").should("not.exist");
  });

  it("should display the retrieved brokers when the user inputs a value", () => {
    cy.intercept("GET", "**/brokers?search=rob", [
      {
        "id": 1,
        "name": "RobCo Industries",
        "address": "3 boulevard Sébastopol",
        "city": "Paris",
        "country": "France"
      }
    ]);
    cy.get("#parties-broker-selector").click().type("rob");
    cy.wait(1000);
    cy.contains("RobCo Industries - 3 boulevard Sébastopol").should("exist");
  })

  it("should display the values of the selected broker", () => {
    cy.contains("RobCo Industries - 3 boulevard Sébastopol").click();
    cy.get("#managing-broker-address").should("contain", "3 boulevard Sébastopol - Paris");
    cy.get("#managing-broker-country").should("contain", "France");
    cy.get("#managing-broker-contact").should("exist");
    cy.get("#managing-broker-commission").should("exist");
  });

  it("should clear all fields when clearing the broker", () => {
    cy.get("[data-testid='CloseIcon'").click();
    cy.get("#managing-broker-address").should("not.exist");
    cy.get("#managing-broker-country").should("not.exist");
    cy.get("#managing-broker-contact").should("not.exist");
    cy.get("#managing-broker-commission").should("not.exist");
    cy.get("#parties-broker-selector").should("not.have.value");
  });

  it("should display an option to add a broker", () => {
    cy.intercept("GET", "**/brokers?search=rob", [
      {
        "id": 1,
        "name": "RobCo Industries",
        "address": "3 boulevard Sébastopol",
        "city": "Paris",
        "country": "France"
      }
    ]);
    cy.get("#parties-broker-selector").click().type("rob");
    cy.wait(1000);
    cy.contains("Or Add manually").should("exist");
  });

  it("should be able to add a broker", () => {
    cy.intercept("POST", "**/brokers").as("createBroker");
    cy.contains("Or Add manually").click();
    cy.get("#add-broker-name").type("new broker");
    cy.get("#add-broker-address").type("new address");
    cy.get("#add-broker-city").type("new city");
    cy.get("#add-broker-country").type("new country");
    cy.get("#add-broker-submit").click();
    cy.wait("@createBroker").its("request.body").should("deep.equal", {
      name: "new broker",
      address: "new address",
      city: "new city",
      country: "new country"
    });
  });

  it("should display the data of the newly created broker", () => {
    cy.get("#parties-broker-selector").should("have.value", "new broker");
    cy.get("#managing-broker-address").should("contain", "new address - new city");
    cy.get("#managing-broker-country").should("contain", "new country");
    cy.get("#managing-broker-contact").should("exist");
    cy.get("#managing-broker-commission").should("exist");
  });
})