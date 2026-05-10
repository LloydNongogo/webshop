Feature: Shopping Cart Checkout
  As a user, I want to purchase a cheap computer to verify the checkout flow.

  Scenario: Successful purchase of a desktop computer
    Given I am on the Demo Webshop login page
    When I login with valid credentials
    And I navigate to "Computers" and select "Desktops"
    And I select "Build your own cheap computer"
    And I add the item to the cart
    And I accept terms and checkout
    And I complete billing and shipping details
    And I select "Cash on Delivery" as payment method
    And I confirm the order
    Then I should see a successful order message and capture the order number