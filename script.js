document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crudForm');
    const itemNameEnInput = document.getElementById('itemNameEn');
    const itemNameArInput = document.getElementById('itemNameAr');
    const addItemModalLabel = document.getElementById('addItemModalLabel');
    const addItemButton = document.querySelector('.modal button[type="submit"]');
    const itemTableBody = document.getElementById('itemTableBody');
    const toggleLangBtn = document.getElementById('toggleLang');
    const headerName = document.getElementById('headerName');
    const headerActions = document.getElementById('headerActions');
    const addItemModalButton = document.getElementById('add-item-modal-btn');
    const mainHeader = document.getElementById('main-header');
    const editForm = document.getElementById('editForm');
    const editItemNameEnInput = document.getElementById('editItemNameEn');
    const editItemNameArInput = document.getElementById('editItemNameAr');
    // Regular expressions for validation
    const englishLettersRegex = /^[A-Za-z\s]*$/;
    const arabicLettersRegex = /^[\u0600-\u06FF\s]*$/;

    let currentEditIndex = null;
    let items = JSON.parse(localStorage.getItem('items')) || [];
    let isEnglish = true;

    // Function to validate English input
    function validateEnglishInput(event) {
        const value = event.target.value;
        if (!englishLettersRegex.test(value)) {
            // Show custom error message if input contains non-English characters
            event.target.setCustomValidity('Please enter only English letters.');
        } else {
            event.target.setCustomValidity(''); // Clear the error if input is valid
        }
        event.target.reportValidity(); // Display the validity message
    }

    // Function to validate Arabic input
    function validateArabicInput(event) {
        const value = event.target.value;
        if (!arabicLettersRegex.test(value)) {
            // Show custom error message if input contains non-Arabic characters
            event.target.setCustomValidity('Please enter only Arabic letters.');
        } else {
            event.target.setCustomValidity(''); // Clear the error if input is valid
        }
        event.target.reportValidity(); // Display the validity message
    }

    // Add event listeners to the English and Arabic input fields
    itemNameEnInput.addEventListener('input', validateEnglishInput);
    itemNameArInput.addEventListener('input', validateArabicInput);
    editItemNameEnInput.addEventListener('input', validateEnglishInput);
    editItemNameArInput.addEventListener('input', validateArabicInput);
    async function loadInitialData() {
        if (items.length === 0) {
            const response = await fetch('data.json');
            const data = await response.json();
            items = data;
            localStorage.setItem('items', JSON.stringify(items));
        }
    }

    function renderItems() {
        itemTableBody.innerHTML = '';
        items.forEach((item, index) => {
            const itemName = isEnglish ? item.name_en : item.name_ar;
            const deleteText = isEnglish ? 'Delete' : 'حذف';
            const editText = isEnglish ? 'Edit' : 'تعديل';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${isEnglish ? index + 1 : convertNumberToArabic(index + 1)}</td>
                <td>${itemName}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editItem(${index})">${editText}</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">${deleteText}</button>
                </td>
            `;
            itemTableBody.appendChild(row);
        });
        updateTableHeaders();
    }

    window.deleteItem = (index) => {
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
    }

    window.editItem = (index) => {
        currentEditIndex = index;
        const item = items[index];
        editItemNameEnInput.value = item.name_en;
        editItemNameArInput.value = item.name_ar;
        $('#editItemModal').modal('show'); // Show the modal
    }

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEn = editItemNameEnInput.value.trim();
        const nameAr = editItemNameArInput.value.trim();
        if (nameEn && nameAr) {
            items[currentEditIndex] = { name_en: nameEn, name_ar: nameAr };
            localStorage.setItem('items', JSON.stringify(items));
            renderItems();
            $('#editItemModal').modal('hide');  // Hide the modal after submission
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEn = itemNameEnInput.value.trim();
        const nameAr = itemNameArInput.value.trim();
        if (nameEn && nameAr) {
            items.push({ name_en: nameEn, name_ar: nameAr });
            localStorage.setItem('items', JSON.stringify(items));
            renderItems();
            itemNameEnInput.value = '';
            itemNameArInput.value = '';
            $('#addItemModal').modal('hide');  // Hide the modal after submission
        }
    });

    toggleLangBtn.addEventListener('click', () => {
        isEnglish = !isEnglish;
        document.body.setAttribute('dir', isEnglish ? 'ltr' : 'rtl');
        document.documentElement.lang = isEnglish ? 'en' : 'ar';
        toggleLangBtn.textContent = isEnglish ? 'Switch to Arabic' : 'Switch to English';
        mainHeader.classList.toggle('text-right');
        addItemModalButton.parentElement.classList.toggle('text-justify');
        renderItems();
        updateTableHeaders();
    });

    function convertNumberToArabic(number) {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return number.toString().replace(/\d/g, (digit) => arabicNumerals[digit]);
    }

    loadInitialData().then(() => {
        renderItems();
    });
    function updateTableHeaders() {
        if (isEnglish) {
            headerName.textContent = 'Item Name';
            headerActions.textContent = 'Actions';
            addItemModalLabel.textContent = 'Add Item';
            document.querySelector('label[for="itemNameEn"]').textContent = 'Item Name (English)';
            document.querySelector('label[for="itemNameAr"]').textContent = 'Item Name (Arabic)';
            itemNameEnInput.placeholder = 'Enter item name in English';
            itemNameArInput.placeholder = 'Enter item name in Arabic';
            addItemButton.textContent = 'Add Item';
            mainHeader.textContent = 'CRUD Operations';
            toggleLangBtn.textContent = 'Switch to Arabic';
            addItemModalButton.textContent = 'Add Item';
            // Update for Edit Item Modal (assuming you have similar elements for edit modal)
            document.getElementById('editItemModalLabel').textContent = 'Edit Item';
            document.querySelector('label[for="editItemNameEn"]').textContent = 'Item Name (English)';
            document.querySelector('label[for="editItemNameAr"]').textContent = 'Item Name (Arabic)';
            document.getElementById('editItemButton').textContent = 'Save Changes';
        } else {
            headerName.textContent = 'اسم العنصر';
            headerActions.textContent = 'الإجراءات';
            addItemModalLabel.textContent = 'إضافة عنصر';
            document.querySelector('label[for="itemNameEn"]').textContent = 'اسم العنصر (بالإنجليزية)';
            document.querySelector('label[for="itemNameAr"]').textContent = 'اسم العنصر (بالعربية)';
            itemNameEnInput.placeholder = 'أدخل اسم العنصر بالإنجليزية';
            itemNameArInput.placeholder = 'أدخل اسم العنصر بالعربية';
            addItemButton.textContent = 'إضافة عنصر';
            mainHeader.textContent = 'عمليات CRUD';
            toggleLangBtn.textContent = 'تحويل اللغة الى الانجليزية';
            addItemModalButton.textContent = 'إضافة عنصر';
            // Update for Edit Item Modal in Arabic
            document.getElementById('editItemModalLabel').textContent = 'تعديل عنصر';
            document.querySelector('label[for="editItemNameEn"]').textContent = 'اسم العنصر (بالإنجليزية)';
            document.querySelector('label[for="editItemNameAr"]').textContent = 'اسم العنصر (بالعربية)';
            document.getElementById('editItemButton').textContent = 'حفظ التغييرات';
        }
    }
});
