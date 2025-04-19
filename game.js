document.addEventListener('DOMContentLoaded', function() {
    const itemInput = document.getElementById('itemInput');
    const addBtn = document.getElementById('addBtn');
    const itemList = document.getElementById('itemList');
    const shareBtn = document.getElementById('shareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const emojiOptions = document.querySelectorAll('.emoji-option');
    
    // Charger les éléments depuis le localStorage
    loadItems();
    
    // Ajouter un élément
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addItem();
        }
    });
    
    // Ajouter des émojis
    emojiOptions.forEach(emoji => {
        emoji.addEventListener('click', function() {
            itemInput.value += emoji.textContent;
            itemInput.focus();
        });
    });
    
    // Partager la liste
    shareBtn.addEventListener('click', shareList);
    
    // Effacer la liste
    clearBtn.addEventListener('click', clearList);
    
    function addItem() {
        const itemText = itemInput.value.trim();
        if (itemText) {
            // Créer un nouvel élément de liste
            const li = document.createElement('li');
            
            // Ajouter le texte
            const span = document.createElement('span');
            span.textContent = itemText;
            li.appendChild(span);
            
            // Ajouter le bouton de suppression
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', function() {
                li.remove();
                saveItems();
            });
            li.appendChild(deleteBtn);
            
            // Ajouter à la liste
            itemList.appendChild(li);
            
            // Effacer le champ de saisie
            itemInput.value = '';
            
            // Sauvegarder
            saveItems();
        }
    }
    
    function saveItems() {
        const items = [];
        document.querySelectorAll('#itemList li span').forEach(item => {
            items.push(item.textContent);
        });
        localStorage.setItem('emojiListItems', JSON.stringify(items));
    }
    
    function loadItems() {
        const savedItems = localStorage.getItem('emojiListItems');
        if (savedItems) {
            JSON.parse(savedItems).forEach(item => {
                itemInput.value = item;
                addItem();
                itemInput.value = '';
            });
        }
    }
    
    function shareList() {
        const items = [];
        document.querySelectorAll('#itemList li span').forEach(item => {
            items.push(item.textContent);
        });
        
        if (items.length === 0) {
            alert('La liste est vide! Ajoutez des éléments avant de partager.');
            return;
        }
        
        const shareText = `Ma liste d'émojis:\n${items.join('\n')}`;
        
        // Vérifier si l'API Web Share est disponible
        if (navigator.share) {
            navigator.share({
                title: 'Ma liste d\'émojis',
                text: shareText
            }).catch(err => {
                console.error('Erreur de partage:', err);
                copyToClipboard(shareText);
            });
        } else {
            // Fallback pour les navigateurs qui ne supportent pas l'API Share
            copyToClipboard(shareText);
        }
    }
    
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Liste copiée dans le presse-papiers!');
    }
    
    function clearList() {
        if (confirm('Êtes-vous sûr de vouloir effacer toute la liste?')) {
            itemList.innerHTML = '';
            localStorage.removeItem('emojiListItems');
        }
    }
});