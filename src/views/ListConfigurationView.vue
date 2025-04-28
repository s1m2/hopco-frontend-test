<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '@/layout/DashboardLayout.vue';
import AppTable from '@/components/common/table/AppTable.vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

import type { Inventory } from '@/types/inventory';

import { storeToRefs } from 'pinia';
import { useListStore } from '@/stores/list';
import { useToastMessages } from '@/composables/useToastMessages';

const listStore = useListStore();
const {
  updateInventoryListItem,
  deleteInventoryListItem,
  addInventoryListItem,
  fetchInventoryList,
} = listStore;
const { inventoryList } = storeToRefs(listStore);
const headers = [{ id: 1, name: 'display_value', display_value: 'Property Name', visible: true }];
const isDialogVisible = ref(false);
const propertyName = ref('');
const toast = useToastMessages();

function toggleDialog() {
  isDialogVisible.value = !isDialogVisible.value;
}

function saveProduct() {
  addInventoryListItem(propertyName.value);
  propertyName.value = '';
  isDialogVisible.value = false;
  toast.showSuccess('Property Name Added Successfully');
}

function deleteInventoryItem(item:Inventory) {
  deleteInventoryListItem(item);
  toast.showSuccess('Property Name Deleted Successfully');
}

onMounted(() => {
  fetchInventoryList();
})
</script>

<template>
  <DashboardLayout>
    <main>
      <Dialog
        v-model:visible="isDialogVisible"
        :style="{ width: '450px' }"
        header="Add New Property"
        :modal="true"
      >
        <div class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-3">Property Name</label>
            <InputText id="name" v-model.trim="propertyName" autofocus fluid />
          </div>
        </div>

        <template #footer>
          <Button label="Cancel" text @click="toggleDialog" />
          <Button label="Save" @click="saveProduct" />
        </template>
      </Dialog>

      <h1 data-test-id="page-title" class="text-2xl font-semibold mb-8">List Configuration</h1>
      <p data-test-id="page-description">Configure your lists here.</p>
      <Toolbar class="mb-6">
        <template #start>
          <Button label="Add New Property" class="mr-2" @click="toggleDialog()" />
        </template>
      </Toolbar>
      <AppTable
        :headers="headers"
        :products="inventoryList"
        :filter_values="['display_value']"
        @row-edit-save="updateInventoryListItem"
        @delete-row="deleteInventoryItem"
      />
    </main>
  </DashboardLayout>
</template>
