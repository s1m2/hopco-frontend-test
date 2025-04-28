<script setup lang="ts">
import { ref } from 'vue';
import DashboardLayout from '@/layout/DashboardLayout.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { storeToRefs } from 'pinia';
import { useListStore } from '@/stores/list';
import { useItemsStore } from '@/stores/items';
import { useToastMessages } from '@/composables/useToastMessages';

const listStore = useListStore();
const itemsStore = useItemsStore();
const toast = useToastMessages();

const { inventoryList } = storeToRefs(listStore);
const { addInventoryItem } = itemsStore;
const { fetchInventoryList } = listStore;

const list = ref({});

function saveItem() {
  addInventoryItem(list.value);
  list.value = {};
  toast.showSuccess('Property Name Added Successfully');
}

fetchInventoryList();

</script>

<template>
  <DashboardLayout>
    <div>
      <p data-test-id="inventory-page-title" class="text-2xl font-semibold mb-8">Add new inventory item</p>
      <main data-test-id="inventory-page-content" class="grid gap-5 grid-cols-1 md:grid-cols-3 mb-8">
        <div v-for="item in inventoryList" :key="item.id" class="grid gap-2">
          <label for="username">{{ item.display_value }}</label>
          <InputText id="username" v-model="list[item.name]" aria-describedby="username-help" />
        </div>
      </main>
      <Button @click="saveItem()">Save Item</Button>
    </div>
  </DashboardLayout>
</template>
