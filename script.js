const form = document.getElementById('productForm');
const updateForm = document.getElementById('updateForm');
const message = document.getElementById('message');
const updateFormContainer = document.getElementById('updateFormContainer');
const updateFormFields = document.getElementById('updateFormFields');
const currentPricesContainer = document.getElementById('currentPricesContainer');
const body = document.body;

const scriptURL = 'https://script.google.com/macros/s/AKfycbwOX0xEOUWARJWwtQG5ERcSp2R66CU_4HnAaHUBAKGo8ZsL40WCW5b-vhluZn2nx433/exec';

function showUpdateForm() {
    updateFormContainer.style.display = 'block';
    body.style.backgroundColor = 'white';
    updateFormFields.style.display = 'none';
    currentPricesContainer.style.display = 'none';
    updateForm.reset();
    form.style.display = 'none';
}

function hideUpdateForm() {
    updateFormContainer.style.display = 'none';
    body.style.backgroundColor = '';
    updateFormFields.style.display = 'none';
    currentPricesContainer.style.display = 'none';
    updateForm.reset();
    form.style.display = 'block';
}

function showProductForm() {
    updateFormContainer.style.display = 'none';
    body.style.backgroundColor = '';
    form.reset();
    form.style.display = 'block';
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

function searchProduct() {
    const productName = document.getElementById('searchProductName').value.toLowerCase();

    fetch(`${scriptURL}?action=search&productName=${encodeURIComponent(productName)}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('displayCurrentPurchasePrice').textContent = 
                formatPrice(data.purchasePrice);
            document.getElementById('displayCurrentSellingPrice').textContent = 
                formatPrice(data.sellingPrice);
            
            document.getElementById('updatePurchasePrice').value = data.purchasePrice;
            document.getElementById('updateSellingPrice').value = data.sellingPrice;
            
            currentPricesContainer.style.display = 'block';
            updateFormFields.style.display = 'block';
            
            alert('Product found!');
            message.className = 'success';
            message.style.display = 'block';
        } else {
            updateFormFields.style.display = 'none';
            currentPricesContainer.style.display = 'none';
            alert('Product not found. Please check the name and try again.');
            message.className = 'error';
            message.style.display = 'block';
        }
    })
    .catch(error => {
        updateFormFields.style.display = 'none';
        currentPricesContainer.style.display = 'none';
        message.innerHTML = 'Error searching for product. Please try again.';
        message.className = 'error';
        message.style.display = 'block';
    });
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = {
        action: 'add',
        productName: document.getElementById('productName').value,
        purchasePrice: document.getElementById('purchasePrice').value,
        sellingPrice: document.getElementById('sellingPrice').value
    };

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => {
        alert('Product data submitted successfully!');
        message.className = 'success';
        message.style.display = 'block';
        form.reset();
    })
    .catch(error => {
        message.innerHTML = 'Error submitting data. Please try again.';
        message.className = 'error';
        message.style.display = 'block';
    });
});

updateForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = {
        action: 'update',
        productName: document.getElementById('searchProductName').value,
        purchasePrice: document.getElementById('updatePurchasePrice').value,
        sellingPrice: document.getElementById('updateSellingPrice').value
    };

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => {
        alert('Product updated successfully!');
        message.className = 'success';
        message.style.display = 'block';
        hideUpdateForm();
    })
    .catch(error => {
        message.innerHTML = 'Error updating product. Please try again.';
        message.className = 'error';
        message.style.display = 'block';
    });
});
