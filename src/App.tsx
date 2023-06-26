import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import Home from './pages/Home.tsx';
import InvoiceDetails from './pages/InvoiceDetails.tsx';
import Navbar from './components/Navbar.tsx';
import Error from './pages/Error.tsx';
import pageNotFound404 from './assets/page-not-found.svg';
import loading from './assets/loading.svg';
import InvoiceForm from './components/InvoiceForm.tsx';
import useInvoiceForm from './store/useInvoiceForm.tsx';

const App = () => {
  const { openInvoiceForm } = useInvoiceForm();
  return (
    <>
      <Navbar />
      {openInvoiceForm && <InvoiceForm />}
      <Suspense fallback={<Error title="Loading..." illustration={loading} />}>
        <Routes>
          <Route path={'/'}>
            <Route index element={<Home />} />
            <Route path="/invoice/:invoiceId" element={<InvoiceDetails />} />
            <Route
              path="/*"
              element={
                <Error
                  title="Page not found :("
                  description="The page you are looking for may have been moved, delete, or possibly never existed."
                  illustration={pageNotFound404}
                  backToHomepageBtn
                />
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
