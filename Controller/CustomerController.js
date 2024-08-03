import { saveCustomer } from "../model/CustomerModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { updateCustomer } from "../model/CustomerModel.js";
import { deleteCustomer } from "../model/CustomerModel.js";

$(document).ready(function () {
  refresh();
});

document
  .querySelector("#CustomerManage #customerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

var id;
var name;
var address;
var salary;

$("#CustomerManage .saveBtn").click(function () {
  id = $("#CustomerManage .custId").val();
  name = $("#CustomerManage .custName").val();
  address = $("#CustomerManage .custAddress").val();
  salary = $("#CustomerManage .custSalary").val();

  let customer = {
    id: id,
    name: name,
    address: address,
    salary: salary,
  };

  let validResult = validate(customer);

  if (validResult) {
    saveCustomer(customer);
    alert("Customer Saved");
    refresh();
  }

  const customerJSON = JSON.stringify(customer);
  console.log(customerJSON);

  //     $.ajax({
  //         url: "http://localhost:5500/FruitShop/customer",
  //         type: "POST",
  //         data: customerJSON,
  //         contentType: "application/json; charset=utf-8",
  //         success: function (response) {
  //           swal("Customer Saved!", response, "success");
  //         },
  //         error: function (xhr, status, error) {
  //           swal("Failed to Saved!", status, "error")
  //         },
  //       });

  // });

  const http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var responseTextJSON = JSON.stringify(http.responseText);
        console.log(responseTextJSON);
      } else {
        console.error("Failed");
        console.error("Status" + http.status);
        console.error("Ready State" + http.readyState);
      }
    } else {
      console.error("Ready State" + http.readyState);
    }
  };
  http.open("POST", "http://localhost:8080/FruitShop/customer", true);
  http.setRequestHeader("Content-Type", "application/json");
  http.send(customerJSON);
});

function validate(customer) {
  let valid = true;

  if (/^C0[0-9]+$/.test(customer.id)) {
    $("#CustomerManage .invalidCustId").text("");
    valid = true;
  } else {
    $("#CustomerManage .invalidCustId").text("Invalid Customer Id");
    valid = false;
  }

  if (/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/.test(customer.name)) {
    $("#CustomerManage .invalidCustName").text("");

    if (valid) {
      valid = true;
    }
  } else {
    $("#CustomerManage .invalidCustName").text("Invalid Customer Name");
    valid = false;
  }

  if (/^[A-Z][a-z, ]+$/.test(customer.address)) {
    $("#CustomerManage .invalidCustAddress").text("");

    if (valid) {
      valid = true;
    }
  } else {
    $("#CustomerManage .invalidCustAddress").text("Invalid Customer Address");
    valid = false;
  }

  if (customer.salary != null && customer.salary > 0) {
    $("#CustomerManage .invalidCustSalary").text("");
    if (valid) {
      valid = true;
    }
  } else {
    $("#CustomerManage .invalidCustSalary").text("Invalid Customer Salary");
    valid = false;
  }

  let customers = getAllCustomers();
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].id === customer.id) {
      $("#CustomerManage .invalidCustId").text("Customer Id Already Exists");
      valid = false;
    }
  }

  return valid;
}

function loadTable(customer) {

  $("#CustomerManage .tableRow").append(

    "<tr> " +
      "<td>" +
      customer.id +
      "</td>" +
      "<td>" +
      customer.name +
      "</td>" +
      "<td>" +
      customer.address +
      "</td>" +
      "<td>" +
      customer.salary +
      "</td>" +
      "</tr>"
  );
}

function extractNumber(id) {
  var match = id.match(/C0(\d+)/);
  if (match && match.length > 1) {
    return parseInt(match[1]);
  }
  return null;
}

function createCustomerId() {
  let customers = getAllCustomers();

  if (!customers || customers.length === 0) {
    return "C01";
  } else {
    let lastCustomer = customers[customers.length - 1];
    let id = lastCustomer && lastCustomer.id ? lastCustomer.id : "C00";

    let number = extractNumber(id);
    number++;
    return "C0" + number;
  }
}

function refresh() {
  $("#CustomerManage .custId").val(createCustomerId());
  $("#CustomerManage .custName").val("");
  $("#CustomerManage .custAddress").val("");
  $("#CustomerManage .custSalary").val("");
  $("#CustomerManage .invalidCustId").text("");
  $("#CustomerManage .invalidCustName").text("");
  $("#CustomerManage .invalidCustAddress").text("");

  reloadTable();
}

$("#CustomerManage .clearBtn").click(function () {
  refresh();
});

$("#CustomerManage .searchBtn").click(function () {
  let customer = searchCustomer($("#CustomerManage .custId").val());
  if (customer) {
    $("#CustomerManage .custName").val(customer.custName);
    $("#CustomerManage .custAddress").val(customer.custAddress);
    $("#CustomerManage .custSalary").val(customer.custSalary);
  } else {
    alert("Customer Not Found");
  }
});

function searchCustomer(id) {
  let customers = getAllCustomers();
  let customer = customers.find((c) => c.custId === id);
  return customer;
}

$("#CustomerManage .updateBtn").click(function () {
  let UpdateCustomer = {
    id: "C00",
    name: $("#CustomerManage .custName").val(),
    address: $("#CustomerManage .custAddress").val(),
    salary: $("#CustomerManage .custSalary").val(),
  };

  let validResult = validate(UpdateCustomer);

  UpdateCustomer.id = $("#CustomerManage .custId").val();

  if (validResult) {
    let customers = getAllCustomers();
    let index = customers.findIndex((c) => c.custId === UpdateCustomer.custId);
    updateCustomer(index, UpdateCustomer);
    alert("Customer Updated");
    refresh();
  }

  const customerJSON = JSON.stringify(updateCustomer);
  console.log(customerJSON);

  const http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var responseTextJSON = JSON.stringify(http.responseText);
        console.log(responseTextJSON);
      } else {
        console.error("Failed");
        console.error("Status" + http.status);
        console.error("Ready State" + http.readyState);
      }
    } else {
      console.error("Ready State" + http.readyState);
    }
  };
  http.open("PUT", "http://localhost:8080/FruitShop/customer", true);
  http.setRequestHeader("Content-Type", "application/json");
  http.send(customerJSON);
});

function reloadTable() {
  let customers = getAllCustomers();
  $("#CustomerManage .tableRow").empty();
  customers.forEach((c) => {
    loadTable(c);
  });
}

$("#CustomerManage .removeBtn").click(function () {
  let customers = getAllCustomers();
  let id = $("#CustomerManage .custId").val();

  let index = customers.findIndex((c) => c.custId === id);
  if (index >= 0) {
    deleteCustomer(index);
    alert("Customer Deleted");
    refresh();
  } else {
    alert("Customer Not Found");
  }
});

$("#CustomerManage .tableRow").on("click", "tr", function () {
  let id = $(this).children("td:eq(0)").text();
  let name = $(this).children("td:eq(1)").text();
  let qty = $(this).children("td:eq(2)").text();
  let price = $(this).children("td:eq(3)").text();

  $("#CustomerManage .custId").val(id);
  $("#CustomerManage .custName").val(name);
  $("#CustomerManage .custAddress").val(qty);
  $("#CustomerManage .custSalary").val(price);
});
