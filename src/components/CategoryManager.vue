<template>
  <div class="category-manager">
    <h2>Gérer les catégories</h2>
    
    <form @submit.prevent="handleSubmit" class="category-form">
      <div class="form-group">
        <label for="categoryName">Nom de la catégorie</label>
        <input
          type="text"
          id="categoryName"
          v-model="newCategory.name"
          required
          class="form-control"
          placeholder="Ex: Projets, Réunions, etc."
        >
      </div>

      <div class="form-group">
        <label for="categoryColor">Couleur</label>
        <input
          type="color"
          id="categoryColor"
          v-model="newCategory.color"
          required
          class="form-control color-picker"
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isEditing ? 'Modifier la catégorie' : 'Ajouter la catégorie' }}
        </button>
        <button 
          v-if="isEditing" 
          type="button" 
          @click="cancelEdit" 
          class="btn btn-secondary"
        >
          Annuler
        </button>
      </div>
    </form>

    <div class="categories-list">
      <h3>Catégories existantes</h3>
      <div class="categories-grid">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <div class="category-color" :style="{ backgroundColor: category.color }"></div>
          <span class="category-name">{{ category.name }}</span>
          <div class="category-actions">
            <button 
              v-if="!isDefaultCategory(category)"
              @click="editCategory(category)" 
              class="btn btn-edit"
            >
              Modifier
            </button>
            <button 
              v-if="!isDefaultCategory(category)"
              @click="deleteCategory(category.id)" 
              class="btn btn-delete"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CategoryManager',
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.getters.isLoading)
    const categories = computed(() => store.getters.getCategories)

    const newCategory = ref({
      name: '',
      color: '#4CAF50'
    })

    const isEditing = ref(false)
    const editingId = ref(null)

    const defaultCategories = ['Travail', 'Personnel', 'Études', 'Santé', 'Autre']

    const isDefaultCategory = (category) => {
      return defaultCategories.includes(category.name)
    }

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await store.dispatch('updateCategory', {
            ...newCategory.value,
            id: editingId.value
          })
          isEditing.value = false
          editingId.value = null
        } else {
          await store.dispatch('addCategory', {
            ...newCategory.value,
            id: Date.now()
          })
        }
        resetForm()
      } catch (error) {
        console.error('Erreur lors de la gestion de la catégorie:', error)
      }
    }

    const editCategory = (category) => {
      newCategory.value = {
        name: category.name,
        color: category.color
      }
      isEditing.value = true
      editingId.value = category.id
    }

    const cancelEdit = () => {
      resetForm()
    }

    const resetForm = () => {
      newCategory.value = {
        name: '',
        color: '#4CAF50'
      }
      isEditing.value = false
      editingId.value = null
    }

    const deleteCategory = async (categoryId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        try {
          await store.dispatch('deleteCategory', categoryId)
        } catch (error) {
          console.error('Erreur lors de la suppression de la catégorie:', error)
        }
      }
    }

    return {
      newCategory,
      isLoading,
      categories,
      isEditing,
      isDefaultCategory,
      handleSubmit,
      editCategory,
      cancelEdit,
      deleteCategory
    }
  }
}
</script>

<style scoped>
.category-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.category-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.color-picker {
  height: 40px;
  padding: 2px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.categories-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.category-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.category-name {
  flex: 1;
}

.category-actions {
  display: flex;
  gap: 5px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f44336;
  color: white;
}

.btn-edit {
  background: #2196F3;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
}

.btn-delete {
  background: #f44336;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-actions {
    flex-direction: column;
  }
}
</style> 