<template>
  <div class="categories-view">
    <div class="categories">
      <h1>Gestion des Catégories</h1>

      <!-- Formulaire d'ajout/modification de catégorie -->
      <div class="category-form modern-form">
        <h2>{{ isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}</h2>
        <form @submit.prevent="saveCategory" autocomplete="off">
          <div class="form-group modern-group">
            <div class="input-wrapper">
              <input
                type="text"
                id="categoryName"
                v-model="categoryForm.name"
                required
                placeholder=" "
              />
              <label for="categoryName">Nom de la catégorie</label>
            </div>
          </div>

          <div class="form-group modern-group">
            <div class="input-wrapper">
              <input
                type="color"
                id="categoryColor"
                v-model="categoryForm.color"
                required
              />
              <label for="categoryColor" class="color-label">Couleur</label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-modern btn-primary">
              {{ isEditing ? 'Modifier' : 'Ajouter' }}
            </button>
            <button 
              v-if="isEditing" 
              type="button" 
              class="btn-modern btn-secondary"
              @click="cancelEdit"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des catégories -->
      <div class="categories-list">
        <h2>Liste des catégories</h2>
        
        <div v-if="categories.length" class="categories-grid">
          <div v-for="category in categories" :key="category.id" class="category-card">
            <div class="category-header">
              <span 
                class="color-preview" 
                :style="{ backgroundColor: category.color }"
              ></span>
              <h3>{{ category.name }}</h3>
            </div>
            
            <div class="category-actions">
              <button 
                @click="editCategory(category)" 
                class="btn btn-edit"
              >
                Modifier
              </button>
              <button 
                @click="deleteCategory(category.id)" 
                class="btn btn-delete"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <div v-else class="no-categories">
          Aucune catégorie n'a été créée
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Categories',
  setup() {
    const store = useStore()
    const categories = computed(() => store.getters.getCategories)
    
    const isEditing = ref(false)
    const categoryForm = ref({
      id: null,
      name: '',
      color: '#607D8B'
    })

    const saveCategory = () => {
      if (isEditing.value) {
        store.dispatch('updateCategory', categoryForm.value)
      } else {
        store.dispatch('addCategory', {
          name: categoryForm.value.name,
          color: categoryForm.value.color
        })
      }
      resetForm()
    }

    const editCategory = (category) => {
      isEditing.value = true
      categoryForm.value = { ...category }
    }

    const deleteCategory = (categoryId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        store.dispatch('deleteCategory', categoryId)
      }
    }

    const cancelEdit = () => {
      resetForm()
    }

    const resetForm = () => {
      isEditing.value = false
      categoryForm.value = {
        id: null,
        name: '',
        color: '#607D8B'
      }
    }

    return {
      categories,
      categoryForm,
      isEditing,
      saveCategory,
      editCategory,
      deleteCategory,
      cancelEdit
    }
  }
}
</script>

<style scoped>
.categories-view {
  position: relative;
  padding: 2rem;
  background-color: #f8fafc;
  min-height: calc(100vh - 80px);
  z-index: 1;
}

.categories {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

h2 {
  margin-bottom: 20px;
  color: #34495e;
}

.category-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input[type="color"] {
  width: 100px;
  height: 40px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #607D8B;
  color: white;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.category-actions {
  display: flex;
  gap: 10px;
}

.no-categories {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

.modern-form {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60,72,88,0.08);
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto 30px auto;
}

.modern-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-wrapper {
  position: relative;
}

input[type="text"] {
  width: 100%;
  padding: 1rem 1rem 1rem 0.75rem;
  border: 1.5px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.2s;
}

input[type="text"]:focus {
  border-color: #3b82f6;
  background: #fff;
}

input[type="color"] {
  width: 48px;
  height: 48px;
  border: none;
  background: none;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

label {
  position: absolute;
  left: 0.8rem;
  top: 1rem;
  color: #888;
  font-size: 1rem;
  pointer-events: none;
  transition: 0.2s;
  background: transparent;
}

input[type="text"]:focus + label,
input[type="text"]:not(:placeholder-shown) + label {
  top: -0.7rem;
  left: 0.5rem;
  font-size: 0.85rem;
  color: #3b82f6;
  background: #fff;
  padding: 0 0.25rem;
}

.color-label {
  position: static;
  display: block;
  margin-bottom: 0.2rem;
  color: #888;
  font-size: 1rem;
}

.btn-modern {
  padding: 0.9rem 1.5rem;
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-right: 0.5rem;
}

.btn-modern.btn-secondary {
  background: #607D8B;
}

.btn-modern:hover {
  background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
}

@media (max-width: 600px) {
  .modern-form {
    padding: 1rem;
    max-width: 100%;
  }
}
</style> 