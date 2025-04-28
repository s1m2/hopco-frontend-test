<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';

import type { Header } from '@/types/header';

type Product = Record<string, any>;
type RowEditSaveEvent = { newData: Product; index: number };

const props = defineProps<{
  headers: Header[]
  products: Product[]
  filter_values: string[]
}>()

const emit = defineEmits<{
  (e: 'row-edit-save', event: { newData: Product; index: number }): void
  (e: 'delete-row', data: Product): void
}>()

const filters = ref(
  Object.fromEntries(
    props.filter_values.map((key) => [key, { value: null, matchMode: FilterMatchMode.CONTAINS }]),
  ),
);

const editingRows = ref([]);

const onRowEditSave = (event: RowEditSaveEvent) => {
  const { newData, index } = event
  emit('row-edit-save', {
    newData,
    index,
  })
}

const selectRow = (data: Product) => {
 emit('delete-row', data)
}
</script>

<template>
  <DataTable
    scrollable
    :value="products"
    v-model:filters="filters"
    v-model:editingRows="editingRows"
    paginator
    :rows="10"
    dataKey="id"
    filterDisplay="row"
    :globalFilterFields="[...filter_values]"
    @row-edit-save="onRowEditSave"
    editMode="row"
  >
    <Column
      v-for="header in headers"
      :key="header.id"
      :field="header.name"
      :header="header.display_value"
      sortable
      style="width: 25%"
    >
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          class="text-sm"
          :placeholder="`Search by ${header.display_value}`"
        />
      </template>

      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column
      :rowEditor="true"
      style="width: 10%; min-width: 8rem"
      bodyStyle="text-align:center"
    ></Column>
    <Column>
      <template #body="{ data }">
        <Button  @click="selectRow(data)" severity="danger" rounded>X</Button>
      </template>
    </Column>
  </DataTable>
</template>
