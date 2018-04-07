'use strict';
/* global $ */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  filter: 'none',
  filteredItems: [],
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  // console.log(items);
  return items.join('');
}

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let shoppingListItemsString;

  if (STORE.filter === 'checked') {
    shoppingListItemsString = generateShoppingItemsString(STORE.filteredItems);
  } else {
    shoppingListItemsString = generateShoppingItemsString(STORE.items);
  }
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// Capture if checkbox is checked
function isCheckBoxChecked() {
  // if the checkbox is checked
  // change the filter in the STORE, from 'none' to 'filtered'
  $('#checkBox').on('click', event => {
    let checkBox = $(event.currentTarget);
    // console.log(checkBoxValue);
    let checkBoxValue = checkBox[0].checked;
    if (checkBoxValue === true) {
      STORE.filter = 'checked';
    } else {
      STORE.filter = 'none';
    }
    console.log(STORE.filter);
    renderShoppingList(STORE.filteredItems);
  });
}

function generateCheckedItems() {
  // Iterate through STORE.items to check for values of checked: true/false
  let listItems = [...STORE.items];
  STORE.filteredItems = listItems.filter(item => {
    if(item.checked === true) {
      return item;
    } 
  });
  console.log(STORE.filteredItems);
  renderShoppingList(STORE.filteredItems);
}

// handleDisplayingCheckedItems is responsible for displaying(in the ul) items which are checked
// function displayingCheckFilteredItems(items) {
//   let filter = STORE.filter;
//   let checkedItems = generateCheckedItems();
//   console.log('checkedItems:', checkedItems);
//   let filteredItems = generateShoppingItemsString(checkedItems);
//   console.log(filteredItems);
  
//   if(filter === 'checked') {
//     renderShoppingList(filteredItems);  
//   }
// }

// handleItemCheckClicked is for the <li>'s
function handleItemCheckClicked() {
  // targets <ul>, event listener(with delegation) on click
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    // logs the function has ran
    console.log('`handleItemCheckClicked` ran');
    // captures the value of the event's current target's index(where it is in the list(STORE))
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // console.log(itemIndex); // Logs index in STORE
    // Modifies the STORE
    toggleCheckedForListItem(itemIndex);
    // Renders the shoppingList
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  generateCheckedItems();
  isCheckBoxChecked();
  // displayingCheckFilteredItems();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);