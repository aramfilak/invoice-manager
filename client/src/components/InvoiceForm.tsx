import './InvoiceForm.scss';
import { Invoice } from '../../@types/invoice';
import { useForm, useFieldArray } from 'react-hook-form';
import { DeleteItem } from '../assets/appIcons';
import { customAlphabet } from 'nanoid';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useInvoice from '../store/useInvoice';
import useInvoiceForm from '../store/useInvoiceForm';
import DropdownMenu from './DropdownMenu';

const EMPTY_INPUT_ERROR_MESSAGE = 'can’t be empty';
const INVALID_INPUT_ERROR_MESSAGE = 'invalid input';
const ID_PATTERN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const TEXT_INPUT_VALIDATION_REGEX = /^[A-Za-z0-9_\-.$+][A-Za-z0-9_\-\s.$+]*$/;
const EMAIL_INPUT_VALIDATION_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const NUMBER_INPUT_VALIDATION_REGEX = /^\d+$/;
const INPUT_MIN_LENGTH = 2;
const paymentTermsOptions = ['Net 1 Day', 'Net 7 Day', 'Net 14 Day', 'Net 30 Day'];

const InvoiceForm: React.FC = () => {
  const [paymentTermsOption, setPaymentTermsOption] = useState<string>('Net 14 Day');
  const [isPending, setIsPending] = useState<boolean>(true);
  const nanoid = customAlphabet(ID_PATTERN, 6);
  const { addInvoice, updateInvoice } = useInvoice();
  const { invoiceFormValue, editInvoice, toggleInvoiceForm } = useInvoiceForm();
  const form = useForm<Invoice>({ defaultValues: invoiceFormValue });
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    rules: {
      required: isPending && 'please add at least one item',
    },
  });
  const calculateItemTotal = () => {
    let itemsTotal = 0;
    fields.forEach((_, idx) => {
      const price = watch(`items.${idx}.price`);
      const quantity = watch(`items.${idx}.quantity`);
      const total = price * quantity;
      itemsTotal += total;
      setValue(`items.${idx}.total`, total);
    });
    setValue('total', itemsTotal);
  };

  useEffect(() => {
    calculateItemTotal();
  }, [fields]);

  const handleItemChange = (idx: number, field: string, value: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    setValue(`items.${idx}.${field}`, value);
    calculateItemTotal();
  };

  const handleFormSubmit = (data: Invoice) => {
    const invoiceID = data.id || nanoid();
    const createdAt = data.createdAt;
    const paymentTerms = Number(paymentTermsOption?.split(' ')[1]);
    let paymentDue = '';

    if (createdAt) {
      const createdDate = new Date(createdAt);
      createdDate.setDate(createdDate.getDate() + Number(paymentTerms));
      paymentDue = createdDate.toISOString().slice(0, 10);
    }

    const invoice: Invoice = {
      id: invoiceID,
      createdAt: createdAt || '',
      paymentDue: paymentDue,
      paymentTerms: paymentTerms,
      description: data.description || '',
      clientName: data.clientName || '',
      clientEmail: data.clientEmail || '',
      status: isPending ? 'pending' : 'draft',
      senderAddress: data.senderAddress || '',
      clientAddress: data.clientAddress || '',
      items: data.items,
      total: data.total,
    };

    if (editInvoice) {
      updateInvoice(invoice);
      toast.success(`#${invoiceID} updated`);
    } else {
      addInvoice(invoice);
      isPending
        ? toast.success(`#${invoiceID} created`)
        : toast.info(`#${invoiceID} created as draft`);
    }

    toggleInvoiceForm();
  };

  return (
    <div className="invoice-form">
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {editInvoice ? <h2>Edit #{invoiceFormValue.id}</h2> : <h2>New Invoice</h2>}

        {/*******************************************
         *******************  Bill from **************
         *******************************************/}
        <h4>Bill from</h4>
        <div className="bill-from">
          <div
            className={`sender-street input-wrapper ${errors.senderAddress?.street && 'invalid'}`}
          >
            <label htmlFor={`senderStreet`}>
              Street Address {errors.senderAddress?.street?.message}
            </label>
            <input
              id="senderStreet"
              type="text"
              {...register('senderAddress.street', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
          <div className={`sender-city input-wrapper ${errors.senderAddress?.city && 'invalid'}`}>
            <label htmlFor={`senderStreet`}>City {errors.senderAddress?.city?.message}</label>
            <input
              id="senderCity"
              type="text"
              {...register('senderAddress.city', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
          <div
            className={`sender-postcode input-wrapper ${
              errors.senderAddress?.postCode && 'invalid'
            }`}
          >
            <label htmlFor={`senderPostCode`}>
              Post Code {errors.senderAddress?.postCode?.message}
            </label>
            <input
              id="senderPostCode"
              type="text"
              {...register('senderAddress.postCode', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
          <div
            className={`sender-country input-wrapper ${errors.senderAddress?.country && 'invalid'}`}
          >
            <label htmlFor={`senderCountry`}>
              Country {errors.senderAddress?.country?.message}
            </label>
            <input
              id="senderCountry"
              type="text"
              {...register('senderAddress.country', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
        </div>

        {/*******************************************
         *******************  Bill To **************
         *******************************************/}
        <h4>Bill to</h4>
        <div className="bill-to">
          <div className={`client-name input-wrapper ${errors.clientName && 'invalid'}`}>
            <label htmlFor="clientName">Client's Name {errors.clientName?.message}</label>
            <input
              id="clientName"
              type="text"
              {...register('clientName', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>

          <div className={`client-email input-wrapper ${errors.clientEmail && 'invalid'}`}>
            <label htmlFor="clientEmail">Client’s Email {errors.clientEmail?.message}</label>
            <input
              id="clientEmail"
              type="text"
              {...register('clientEmail', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: EMAIL_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
          <div
            className={`client-street input-wrapper ${errors.clientAddress?.street && 'invalid'}`}
          >
            <label htmlFor={`clientStreet`}>Street {errors.clientAddress?.street?.message}</label>
            <input
              id="clientStreet"
              type="text"
              {...register('clientAddress.street', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
          <div className={`client-city input-wrapper ${errors.clientAddress?.city && 'invalid'}`}>
            <label htmlFor={`clientCity`}>City {errors.clientAddress?.city?.message}</label>
            <input
              id="clientCity"
              type="text"
              {...register('clientAddress.city', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>

          <div
            className={`client-postcode input-wrapper ${
              errors.clientAddress?.postCode && 'invalid'
            }`}
          >
            <label htmlFor={`clientPostCode`}>
              Post Code {errors.clientAddress?.postCode?.message}
            </label>
            <input
              id="clientPostCode"
              type="text"
              {...register('clientAddress.postCode', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>

          <div
            className={`client-country input-wrapper ${errors.clientAddress?.country && 'invalid'}`}
          >
            <label htmlFor={`clientCountry`}>
              Country {errors.clientAddress?.country?.message}
            </label>
            <input
              id="clientCountry"
              type="text"
              {...register('clientAddress.country', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                pattern: {
                  value: TEXT_INPUT_VALIDATION_REGEX,
                  message: INVALID_INPUT_ERROR_MESSAGE,
                },
                minLength: INPUT_MIN_LENGTH,
              })}
            />
          </div>
        </div>

        {/*******************************************
         *********** Date and Description ***********
         *******************************************/}
        <div className="date">
          <div className={`input-wrapper ${errors.createdAt && 'invalid'}`}>
            <label htmlFor="invoice-date">Issue Date {errors.createdAt?.message}</label>
            <input
              type="date"
              id="invoice-date"
              {...register('createdAt', {
                required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
              })}
            />
          </div>
          <div className={`input-wrapper`}>
            <label>Payment Terms</label>
            <DropdownMenu
              menuMobilName="Net 14 Day"
              menuNameFull="Net 14 Day"
              menuOptions={paymentTermsOptions}
              dispatchFunc={setPaymentTermsOption}
            />
          </div>
        </div>

        <div className={`project-description input-wrapper ${errors.description && 'invalid'}`}>
          <label htmlFor="productDescription">
            Project Description {errors.description?.message}
          </label>
          <input
            id="productDescription"
            type="text"
            {...register('description', {
              required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
              pattern: {
                value: TEXT_INPUT_VALIDATION_REGEX,
                message: INVALID_INPUT_ERROR_MESSAGE,
              },
              minLength: INPUT_MIN_LENGTH,
            })}
          />
        </div>
        {/*******************************************
         ****************** Items ********************
         *******************************************/}
        <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
          Item List <span className="invalid"> {errors.items?.root?.message}</span>
        </h3>

        <ul className="items-list">
          {fields.map((filed, idx) => (
            <li key={filed.id} className="item">
              <div
                className={`name input-wrapper ${
                  errors.items && errors.items[idx]?.name && 'invalid'
                }`}
              >
                <label htmlFor={`name__${filed.id}`}>Name</label>
                <input
                  id={`name__${filed.id}`}
                  type={'text'}
                  {...register(`items.${idx}.name`, {
                    value: '',
                    required: isPending && EMPTY_INPUT_ERROR_MESSAGE,
                    pattern: {
                      value: TEXT_INPUT_VALIDATION_REGEX,
                      message: INVALID_INPUT_ERROR_MESSAGE,
                    },
                    minLength: INPUT_MIN_LENGTH,
                  })}
                />
              </div>
              <div
                className={`quantity input-wrapper ${
                  errors.items && errors.items[idx]?.quantity && 'invalid'
                }`}
              >
                <label htmlFor={`quantity__${filed.id}`}>
                  Qun. {errors.items && errors.items[idx]?.quantity?.message}
                </label>
                <input
                  id={`quantity__${filed.id}`}
                  type="text"
                  min={0}
                  {...register(`items.${idx}.quantity`, {
                    pattern: {
                      value: NUMBER_INPUT_VALIDATION_REGEX,
                      message: '',
                    },
                    onChange: (e) => handleItemChange(idx, 'quantity', e.target.value),
                  })}
                />
              </div>
              <div
                className={`price input-wrapper ${
                  errors.items && errors.items[idx]?.price && 'invalid'
                }`}
              >
                <label htmlFor={`price__${filed.id}`}>
                  Price {errors.items && errors.items[idx]?.price?.message}
                </label>
                <input
                  id={`price__${filed.id}`}
                  type="text"
                  {...register(`items.${idx}.price`, {
                    pattern: {
                      value: NUMBER_INPUT_VALIDATION_REGEX,
                      message: '',
                    },
                    onChange: (e) => handleItemChange(idx, 'price', e.target.value),
                  })}
                />
              </div>
              <div className="total input-wrapper">
                <label htmlFor={`total__${filed.id}`}>Total</label>
                <input
                  id={`total__${filed.id}`}
                  type={'text'}
                  disabled={true}
                  {...register(`items.${idx}.total`)}
                />
              </div>
              <button className="delete-item-btn" type="button" onClick={() => remove(idx)}>
                <DeleteItem />
              </button>
              <p className="invalid">{errors.items?.root?.message}</p>
            </li>
          ))}
        </ul>
        <button
          className="add-item-btn"
          type="button"
          onClick={() => append({ name: '', price: 0, total: 0, quantity: 0 })}
        >
          + Add New Item
        </button>
        {/*******************************************
         ****************** actions *****************
         *******************************************/}
        <div className="actions">
          <button
            value="draft"
            {...register('status')}
            onClick={() => {
              toggleInvoiceForm();
            }}
            className="discard-btn"
          >
            {editInvoice ? 'Cancel' : 'Discard'}
          </button>
          <div className="right-wrapper">
            <button className="save-as-draft-btn" type="submit" onClick={() => setIsPending(false)}>
              Save as Draft
            </button>
            <button
              className="save-and-send-btn"
              type="submit"
              onClick={() => () => setIsPending(true)}
            >
              Save & Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
