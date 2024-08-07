import { getAllOrders } from "../model/OrderModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { getAllItems, updateItem } from "../model/ItemModel.js";
import { saveOrder } from "../model/OrderModel.js";

import { itemarray } from "./ItemController.js";
import { customerarray } from "./CustomerController.js";

var code;
var itemQty;
var orderQty;

$(document).ready(function () {
  refresh();
});

$(".orderManageBtn").click(function () {
  refresh();
});

function refresh() {
  $("#OrderManage .orderId").val(generateId());
  $("#OrderManage .orderDate").val(new Date().toISOString().split("T")[0]);
  loadCustomer();
  loadItems();
//   $("#OrderManage .Total").text("");
//   $("#OrderManage .SubTotal").text("");
//   $("#OrderManage .SubTotal").text("");
//   $("#OrderManage .Balance").val("");
//   $("#OrderManage .Cash").val("");
//   $("#OrderManage .Discount").val("");
}

function extractNumber(id) {
  var match = id.match(/OD(\d+)/);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

function generateId() {
  console.log("Get all array",itemarray);
  console.log("Get all array",customerarray);

  let orders = getAllOrders();

  // alert(orders.length);

  if (orders.length === 0) {
    return "OD01";
  } else {
    // alert('awa');
    let orderId = orders[orders.length - 1].orderId;
    let number = extractNumber(orderId);
    number++;
    // alert('OD0' + number);
    return "OD0" + number;
  }
}

function loadCustomer() {
  let cmb = $("#OrderManage .customers");
  cmb.empty();
  let option = [];
  let customers = getAllCustomers();
  option.unshift("");
  for (let i = 0; i < customerarray.length; i++) {
    option.push(customerarray[i].id);
  }

  $.each(option, function (index, value) {
    cmb.append($("<option>").val(value).text(value));
  });
}

$("#OrderManage .customers").change(function () {
  let customer = customerarray.find((c) => c.id === $(this).val());
  $("#OrderManage .custId").val(customer.id);
  $("#OrderManage .custName").val(customer.name);
  $("#OrderManage .custAddress").val(customer.address);
  $("#OrderManage .custSalary").val(customer.salary);
});

function loadItems() {
  let cmb = $("#OrderManage .itemCmb");
  cmb.empty();
  let option = [];
  let items = getAllItems();

  for (let i = 0; i < itemarray.length; i++) {
    option.push(itemarray[i].code);
  }

  option.unshift("");

  $.each(option, function (index, value) {
    cmb.append($("<option>").val(value).text(value));
  });
}

$("#OrderManage .itemCmb").change(function () {
  let item = itemarray.find((i) => i.code === $(this).val());
  code = item.code;
  // alert(item.itemQty);
  itemQty = item.itemQty;
  $("#OrderManage .addBtn").text("Add");
  $("#OrderManage .itemCode").val(item.code);
  $("#OrderManage .itemName").val(item.description);
  $("#OrderManage .itemQty").val(item.quantity);
  $("#OrderManage .itemPrice").val(item.price );
});

let getItems = [];

function clear(tableCount) {
  if (tableCount === 1) {
    $("#OrderManage .itemCode").val("");
    $("#OrderManage .itemName").val("");
    $("#OrderManage .itemPrice").val("");
    $("#OrderManage .itemQty").val("");
    $("#OrderManage .orderQty").val("");
    $("#OrderManage .SubTotal").text("");
    $("#OrderManage .Cash").val("");
    $("#OrderManage .Total").text("");
    $("#OrderManage .Discount").val("");
    $("#OrderManage .itemCmb").val("");
  } else {
    $("#OrderManage .custId").val("");
    $("#OrderManage .custName").val("");
    $("#OrderManage .custAddress").val("");
    $("#OrderManage .custSalary").val("");
    $("#OrderManage .itemCode").val("");
    $("#OrderManage .itemName").val("");
    $("#OrderManage .itemPrice").val("");
    $("#OrderManage .itemQty").val("");
    $("#OrderManage .orderQty").val("");
  }
}

$("#OrderManage .addBtn").click(function () {
  if ($("#OrderManage .addBtn").text() === "delete") {
    dropItem();
  } else {
    let getItem = {
      code: $("#OrderManage .itemCode").val(),
      description: $("#OrderManage .itemName").val(),
      price: parseFloat($("#OrderManage .itemPrice").val()),
      quantity: parseInt($("#OrderManage .orderQty").val(), 10),
      total:
        parseFloat($("#OrderManage .itemPrice").val()) *
        parseInt($("#OrderManage .orderQty").val(), 10),
    };

    let itemQty = parseInt($("#OrderManage .itemQty").val(), 10);
    let orderQty = parseInt($("#OrderManage .orderQty").val(), 10);

    if (itemQty >= orderQty) {
      if (
        $("#OrderManage .custId").val() !== "" &&
        $("#OrderManage .custName").val() !== null
      ) {
        if (orderQty > 0) {
          
          let item = getItems.find((I) => I.code=== getItem.code);
          if (item == null) {
            getItems.push(getItem);
            loadTable();
            clear(1);
            setTotal();
          } else {
            alert("Already Added");
          }
        } else {
          alert("Invalid Quantity");
        }
      } else {
        alert("Invalid Customer");
      }
    } else {
      alert("Not Enough Quantity");
    }
  }
});

function loadTable() {
  $("#OrderManage .tableRows").empty();
  for (let i = 0; i < getItems.length; i++) {
    $("#OrderManage .tableRows").append(
      "<div> " +
        "<div>" +
        getItems[i].code +
        "</div>" +
        "<div>" +
        getItems[i].description +
        "</div>" +
        "<div>" +
        getItems[i].price  +
        "</div>" +
        "<div>" +
        getItems[i].quantity +
        "</div>" +
        "<div>" +
        getItems[i].total +
        "</div>" +
        "</tr>"
    );
  }
}

function setTotal() {
  let total = 0;
  for (let i = 0; i < getItems.length; i++) {
    total += getItems[i].total;
  }
  $("#OrderManage .Total").text(total);
}
// function setSubTotal() {
//   let total = parseFloat($("#OrderManage .Total").text());
//   let discount = parseFloat($("#OrderManage .Discount").val());

//   if (cash >= total) {
//     if (discount >= 0 && discount < 100) {
//       let subTotal = total - total * (discount / 100);

//       $("#OrderManage .SubTotal").text(subTotal);
//     }
//   }
// }
$("#OrderManage .placeOrder").click(function () {
  let cash = parseFloat($("#OrderManage .Cash").val());
  let total = parseFloat($("#OrderManage .Total").text());
  let discount = ($("#OrderManage .Discount").val());
  // alert(cash + ' ' + total + ' ' + discount);

  if (cash >= total) {
    if (discount >= 0 && discount < 100) {
      let subTotal = total - total * (discount / 100);

      $("#OrderManage .SubTotal").text(subTotal.toFixed(2));
      let balance = cash - subTotal;
      $("#OrderManage .Balance").val(balance.toFixed(2));
      console.log("get Item",getItems)
      let Order = {
        orderId: $("#OrderManage .orderId").val(),
        date: $("#OrderManage .orderDate").val(),
        customerId: $("#OrderManage .custId").val(),
        itemDtoList: getItems,
        total: total,
        discount: discount,
        subTotal: subTotal,
        cash: cash,
        balance: balance,
      };


      saveOrder(Order);
      updateItemData();
      getItems = [];
      loadTable();
      clear(2);
      alert("Order Placed");
      refresh();

      const orderJSON = JSON.stringify(Order);
  console.log(orderJSON);

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
  http.open("POST", "http://localhost:8080/FruitShop/placeOrder", true);
  http.setRequestHeader("Content-Type", "application/json");
  http.send(orderJSON);

    } else {
      alert("Invalid Discount");
    }
  } else {
    alert("Not Enough Cash");
  }

  

});


function updateItemData() {
  
  for (let i = 0; i < getItems.length; i++) {
    let item = itemarray.find((I) => I.code === getItems[i].code);
    console.log("item",item)
    item.quantity -= getItems[i].quantity;

    let index = itemarray.findIndex((I) => I.code === getItems[i].code);
    //updateItem(index, item);
    let code=item.code;
    // let items = getAllItems();
   // let index = itemarray.findIndex((i) => i.code === item2.code);
    //updateItem( item);
    refresh();

const updateItemJSON = JSON.stringify(item);
console.log("Json",updateItemJSON)
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
http.open(
"PUT",
`http://localhost:8080/FruitShop/item?itemCode=${code}`,
true
);
http.setRequestHeader("Content-Type", "application/json");
http.send(updateItemJSON);

 

  }
//   let qty1=$("#OrderManage .itemQty").val()
//   let qty2=$("#OrderManage .orderQty").val()
//   let des= $('#OrderManage .itemName').val()
//   let price=$('#OrderManage .itemPrice').val()
//   let code1=$('#OrderManage .itemCode').val()
//   let finalqty=qty1-qty2;
//  let item2 = {
//     code : 'I00',
//     description :des,
//     quantity :finalqty,
//     price:price 
// };




   
}

$(".mainTable .tableRows").on("click", "div", function () {
  let itemCode = $(this).children("div:eq(0)").text();
  let itemName = $(this).children("div:eq(1)").text();
  let price = $(this).children("div:eq(2)").text();
  let qty = $(this).children("div:eq(3)").text();

  $("#OrderManage .itemCode").val(itemCode);
  $("#OrderManage .itemName").val(itemName);
  $("#OrderManage .itemPrice").val(price);
  $("#OrderManage .orderQty").val(qty);

  $("#OrderManage .ItemSelect .addBtn").text("delete");
});

function dropItem() {
  let itemCode = $("#OrderManage .itemCode").val();
  let item = getItems.find((I) => I.itemCode === itemCode);
  let index = getItems.findIndex((I) => I.itemCode === itemCode);
  getItems.splice(index, 1);
  alert("Item Removed");
  loadTable();
  clear(1);
  setTotal();
}

// $('#orderManage .itemCmb')
