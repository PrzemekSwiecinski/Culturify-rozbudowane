import React from "react";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import MainPage from "./views/MainPage";
import AddOrganizer from "./views/AddOrganizer";
import AddImages from "./views/AddImages";
import AddEvent from "./views/AddEvent";
import LoginViewOrganizer from "./views/LoginViewOrganizer";
import LoginViewModerator from "./views/LoginViewModerator";
import LoginViewAdmin from "./views/LoginViewAdmin";
import AboutUs from "./views/AboutUs";
import Gallery from "./views/Gallery";
import Blog from "./views/Blog";
import TermsAndConditions from "./views/TermsAndConditions";
import Contact from "./views/Contact";
import OrganizerView from "./views/OrganizerView";
import UserView from "./views/UserView";
import UsersTickets from "./views/UsersTickets";
import TicketMarket from "./views/TicketMarket";
import OrganizerEvents from "./views/OrganizerEvents";
import AdminPanel from "./views/AdminPanel";
import PostEdit from "./views/PostEdit";
import AdminGallery from "./views/AdminGallery";
import ModMainPage from "./views/ModMainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./components/CartProvider";

function App() {
  return (
    <CartProvider>
      {" "}
      {/* Owiń całą aplikację w CartProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/rejestracja" element={<RegisterView />} />
          <Route path="/onas" element={<AboutUs />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/regulamin" element={<TermsAndConditions />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dodawanie_organizatora" element={<AddOrganizer />} />
          <Route path="/dodawanie_zdjec" element={<AddImages />} />
          <Route path="/dodawanie_wydarzen" element={<AddEvent />} />
          <Route path="/bilety_uzytkownika" element={<UsersTickets />} />
          <Route path="/rynek_biletow" element={<TicketMarket />} />
          <Route path="/profil_organizatora" element={<OrganizerView />} />
          <Route path="/profil_uzytkownika" element={<UserView />} />
          <Route path="/login_organizatora" element={<LoginViewOrganizer />} />
          <Route path="/login_moderatora" element={<LoginViewModerator />} />
          <Route path="/login_admin" element={<LoginViewAdmin />} />
          <Route path="/edycja_postow" element={<PostEdit />} />
          <Route
            path="/wydarzenia_organizatora"
            element={<OrganizerEvents />}
          />
          <Route path="/panel_admina" element={<AdminPanel />} />
          <Route path="/galeria_admina" element={<AdminGallery />} />
          <Route path="/mod_glowna" element={<ModMainPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
