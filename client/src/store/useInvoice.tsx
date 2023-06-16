import { create } from 'zustand';
import { Invoice } from '../../@types/invoice';
import data from '../data/data-demo.json';

interface State {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markInvoiceAsPaid: (id: string) => void;
  filterByStatus: (status: string) => void;
}

const useInvoice = create<State>((set) => ({
  invoices: data,

  addInvoice: (invoice: Invoice) =>
    set((state) => ({
      invoices: [...state.invoices, invoice],
    })),

  updateInvoice: (updatedInvoice: Invoice) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) => {
        if (invoice.id === updatedInvoice.id) {
          return { ...invoice, ...updatedInvoice };
        } else {
          return invoice;
        }
      }),
    })),

  deleteInvoice: (id: string) =>
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    })),

  filterByStatus: (status: string) =>
    set((state) => ({
      invoices: state.invoices.sort((a, b) => {
        if (a.status === status) {
          return -1;
        } else if (b.status === status) {
          return 1;
        } else {
          return 0;
        }
      }),
    })),

  markInvoiceAsPaid: (id: string) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: 'paid' } : invoice
      ),
    })),
}));

export default useInvoice;
