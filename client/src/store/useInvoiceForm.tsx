import { create } from 'zustand';
import { Invoice } from '../../@types/invoice';

interface State {
  invoiceFormValue: Invoice;
  openInvoiceForm: boolean;
  editInvoice: boolean;
  updateInvoiceFormValue: (invoice: Invoice) => void;
  toggleInvoiceForm: () => void;
  resetInvoiceForm: () => void;
  setEditInvoice: (value: boolean) => void;
}

const invoiceFormInitialValue: Invoice = {
  id: '',
  createdAt: '',
  paymentDue: '',
  description: '',
  paymentTerms: 14,
  clientName: '',
  clientEmail: '',
  status: '',
  senderAddress: {
    street: '',
    city: '',
    postCode: '',
    country: '',
  },
  clientAddress: {
    street: '',
    city: '',
    postCode: '',
    country: '',
  },
  items: [],
  total: 0,
};

const useInvoiceForm = create<State>((set) => ({
  editInvoice: false,
  openInvoiceForm: false,
  invoiceFormValue: invoiceFormInitialValue,

  updateInvoiceFormValue: (invoice: Invoice) => {
    set(() => ({ invoiceFormValue: invoice }));
  },
  toggleInvoiceForm: () =>
    set((state) => ({
      openInvoiceForm: !state.openInvoiceForm,
    })),
  setEditInvoice: (value: boolean) =>
    set(() => ({
      editInvoice: value,
    })),
  resetInvoiceForm: () =>
    set(() => ({
      invoiceFormValue: invoiceFormInitialValue,
    })),
}));

export default useInvoiceForm;
