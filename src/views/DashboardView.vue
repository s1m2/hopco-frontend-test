<script setup lang="ts">
import AppTable from '@/components/common/table/AppTable.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '@/stores/list'
import { useItemsStore } from '@/stores/items'

const listStore = useListStore()
const itemsStore = useItemsStore()

const { fetchInventoryList } = listStore
const { getAllInventoryItems, updateInventoryListItem, deleteInventoryListItem } = itemsStore

const { inventoryList, filters } = storeToRefs(listStore)
const { items } = storeToRefs(itemsStore)

fetchInventoryList()
getAllInventoryItems()
</script>

<template>
  <DashboardLayout>
    <main>
      <p data-test-id="dashboard-page-title" class="text-2xl font-semibold mb-8">Welcome back to your dashboard</p>
      <AppTable
        :headers="inventoryList"
        :filter_values="filters"
        :products="items"
        @row-edit-save="updateInventoryListItem"
        @delete-row="deleteInventoryListItem"
      />
    </main>
  </DashboardLayout>
</template>
