"use strict";

class TipCalculator {
  constructor(tipOutput, totalOutput) {
    this.tipOutput = tipOutput;
    this.totalOutput = totalOutput;
    this.billValue = 0;
    this.countValue = 0; // Default count is 0
    this.isCountValid = false; // Track if count is valid
    this.customPercentage = 0; // Default custom percentage is 0
    this.handleReset();
  }

  handleErrorMessage(element, message, input) {
    element.classList.remove("hide");
    element.textContent = message;
    input.classList.add("errorstate");
    setTimeout(() => {
      element.classList.add("hide");
      input.value = "";
    }, 2000);
  }

  handleClearErrorMessage(element, input) {
    element.classList.add("hide");
    element.textContent = " ";
    input.classList.remove("errorstate");
  }

  handleBillValidation() {
    const bill = parseFloat(billInput.value.trim());
    this.billValue = bill;

    if (isNaN(bill) || bill <= 0) {
      this.handleErrorMessage(
        billErrorMessage,
        "Invalid bill amount",
        billInput
      );
    } else {
      this.handleClearErrorMessage(billErrorMessage, billInput);
    }
  }

  handleCountValidation() {
    const countInputValue = countInput.value.trim();

    //Regular number
    const isWholeNumber = /^\d+$/;
    const count = parseInt(countInputValue, 10);

    if (!isWholeNumber.test(countInputValue) || isNaN(count) || count <= 0) {
      // Allow 0 as a valid input
      this.handleErrorMessage(countErrorMessage, "Invalid count", countInput);
      this.countValue = 0;
      this.isCountValid = false;
    } else {
      this.handleClearErrorMessage(countErrorMessage, countInput);
      this.countValue = count;
      this.isCountValid = count > 0;
    }

    //Trigger calculation if both bill and count are valid

    if (this.billValue > 0 && this.isCountValid) {
      this.compute();
    }
  }

  handleCustomValidation() {
    const custom = parseFloat(customeValue.value.trim());
    if (isNaN(custom) || custom < 0) {
      // Allow 0 and positive values
      customeValue.classList.add("errorstate");
      customeValue.value = "";
      this.customPercentage = 0; // Default to 0 if invalid
      setTimeout(() => {
        customeValue.classList.remove("errorstate");
      }, 2000);
    } else {
      this.customPercentage = custom; // Update custom percentage
      customeValue.classList.remove("errorstate");
    }

    // Trigger calculation if both bill and count are valid
    if (this.billValue > 0 && this.isCountValid) {
      this.compute();
    }
  }

  currentOperation(e) {
    if (!e || !e.target) {
      throw new Error("Event object or target is missing");
    }
    return e.target.textContent.trim();
  }

  compute() {
    if (this.billValue > 0 && this.isCountValid) {
      const operation = this.currentOperation({
        target: { textContent: "5%" },
      }); // Placeholder for actual event
      let tip;

      switch (operation) {
        case "5%":
          tip = this.billValue * 0.05;
          break;
        case "10%":
          tip = this.billValue * 0.1;
          break;
        case "15%":
          tip = this.billValue * 0.15;
          break;
        case "25%":
          tip = this.billValue * 0.25;
          break;
        case "50%":
          tip = this.billValue * 0.5;
          break;
        default:
          tip = 0;
      }

      // Add custom percentage to the tip
      if (this.customPercentage > 0) {
        tip += this.billValue * (this.customPercentage / 100);
      }

      this.tipOutput.textContent = `$${(tip * this.countValue).toFixed(2)}`;
      this.totalOutput.textContent = `$${(
        this.billValue * this.countValue +
        tip
      ).toFixed(2)}`;
    } else {
      this.tipOutput.textContent = "$0.00";
      this.totalOutput.textContent = "$0.00";
    }
  }

  handleReset() {
    billInput.value = "";
    countInput.value = ""; // Reset to default count of 0
    customeValue.value = "";
    this.tipOutput.textContent = "$0.00";
    this.totalOutput.textContent = "$0.00";
    this.billValue = 0;
    this.countValue = 0; // Reset countValue to default
    this.isCountValid = false; // Reset count validity flag
    this.customPercentage = 0; // Reset custom percentage

    // Remove the error state
    countInput.classList.remove("errorstate");
    billInput.classList.remove("errorstate");
  }
}

const parent = document.getElementById("main");

// inputs
const billInput = parent.querySelector("[data-bill]");
const countInput = parent.querySelector("[data-count]");

// buttons
const btnPercentage = parent.querySelectorAll("[data-tip-Percentage]");
const customeValue = parent.querySelector("[data-tip-Custom]");

// error handling
const countErrorMessage = parent.querySelector("[data-errorCount]");
const billErrorMessage = parent.querySelector("[data-errorBill]");

// output
const tipOutput = parent.querySelector("[data-tipAmount]");
const totalOutput = parent.querySelector("[data-total]");
const resetBtn = parent.querySelector("[data-reset]");

const calculator = new TipCalculator(tipOutput, totalOutput);

btnPercentage.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    try {
      calculator.compute(e); // Pass the event object
    } catch (error) {
      console.error(error.message); // Handle error if event is missing
    }
  });
});

resetBtn.addEventListener("click", function (e) {
  e.preventDefault();
  calculator.handleReset();
});

billInput.addEventListener("input", function (e) {
  e.preventDefault();
  calculator.handleBillValidation();
});

countInput.addEventListener("input", function (e) {
  e.preventDefault();
  calculator.handleCountValidation();
});

customeValue.addEventListener("input", function (e) {
  e.preventDefault();
  calculator.handleCustomValidation();
});
