import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import DecksPage from "./Decks/DecksPage"
import DeckDetailPage from "./Decks/DeckDetailPage";
import DeckEditPage from "./Builder/DeckEditPage";
import DeckCopyPage from "./Builder/DeckCopyPage";
import CardsPage from "./Cards/CardsPage"
import CardCreatePage from "./Cards/CardCreatePage";
import CardDetailPage from "./Cards/CardDetailPage";
import TopCardsPage from "./Cards/TopCardsPage";
import SetsPage from "./Cards/SetsPage";
import CardSetCreate from "./Cards/SetCreatePage";
import SetDetailPage from "./Cards/SetDetailPage";
import PullPage from "./Cards/PullPage";
import UnderConstruction from "./Display/UnderConstruction";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LightSwitch from "./Display/LightSwitch";
import BackToTop from "./Display/BackToTop";
import "./Massive.css"
import AppProvider from "./Context/AppProvider";
import PullsDeckBuilder from "./Builder/PullsDeckBuilder";
import AccountPage from "./Accounts/AccountPage";
import ResetPassword from "./Accounts/ResetPasswordPage";
import GameCards from "./Cards/GameCards";
import GameDecks from "./Decks/GameDecks";
import DeckImport from "./Builder/DeckBuildandImport";
import CardCategoriesPage from "./GamePlay/Categories/CardCategoriesPage";
import CardCategoriesCreate from "./GamePlay/Categories/CardCategoryCreatePage";
import CardCategoryEdit from "./GamePlay/Categories/CardCategoryEditPage";
import CardCategoryDetail from "./GamePlay/Categories/CardCategoryDetailPage";
import CardTagCreate from "./GamePlay/CardTags/CardTagCreatePage";
import CardTagEdit from "./GamePlay/CardTags/CardTagEditPage";
import CardTagDetails from "./GamePlay/CardTags/CardTagDetailPage";
import CardTypeCreate from "./GamePlay/CardTypes/CardTypeCreatePage";
import CardTypeEdit from "./GamePlay/CardTypes/CardTypeEditPage";
import CardTypeDetails from "./GamePlay/CardTypes/CardTypeDetailPage";
import ExtraEffectsPage from "./GamePlay/ExtraEffects/ExtraEffectsPage";
import ExtraEffectCreate from "./GamePlay/ExtraEffects/ExtraEffectCreate";
import ExtraEffectEdit from "./GamePlay/ExtraEffects/ExtraEffectEdit";
import ExtraEffectDetails from "./GamePlay/ExtraEffects/ExtraEffectDetailPage";
import ReactionCreate from "./GamePlay/Reactions/ReactionCreatePage";
import ReactionEdit from "./GamePlay/Reactions/ReactionEditPage";
import ReactionDetails from "./GamePlay/Reactions/ReactionDetailPage";
import GamePlayPage from "./GamePlay/GamePlayPage";
import CardTagsPage from "./GamePlay/CardTags/CardTagsPage";
import CardTypesPage from "./GamePlay/CardTypes/CardTypesPage";
import ReactionsPage from "./GamePlay/Reactions/ReactionsPage";
import SimulatorPage from "./Simulator/SimulatorPage";
import CreatePortal from "./Accounts/CreatePortal";
import TermCreate from "./GamePlay/Terms/TermCreatePage";
import TermsPage from "./GamePlay/Terms/TermsPage";
import TermEdit from "./GamePlay/Terms/TermEditPage";
import StoryCreate from "./Articles/StoryCreatePage";
import ArticlesPage from "./Articles/ArticlesPage";
import ArticlePage from "./Articles/ArticlePage";
import ArticleCreatePage from "./Articles/ArticleCreatePage";
import ArticleEditPage from "./Articles/ArticleEditPage";
import DeckSheetPage from "./Decks/DeckSheetPage";
import HowToCreatePage from "./GamePlay/HowTos/HowToCreatePage";
import HowToPage from "./GamePlay/HowTos/HowToPage";
import HowToEditPage from "./GamePlay/HowTos/HowToEditPage";
import HowTosPage from "./GamePlay/HowTos/HowTosPage";


function App() {

  return (

    <AppProvider>

    <BrowserRouter>
        <div className="content">
          <NavBar/>
          <LightSwitch/>
          <BackToTop/>
          <div className="app">

            <Routes>
              <Route index element={<MainPage />} />
              <Route path="/deckbuilder" element={<DeckImport />} />
              <Route path="/decks" element={<DecksPage />} />
              <Route path="/decks/:deck_id" element={<DeckDetailPage />} />
              <Route path="/decks/:deck_id/edit" element={<DeckEditPage />} />
              <Route path="/decks/:deck_id/copy" element={<DeckCopyPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/cardcreate" element={<CardCreatePage />} />
              <Route path="/cards/:card_number" element={<CardDetailPage />} />
              <Route path="/topcards" element={<TopCardsPage />} />
              <Route path="/cardsets" element={<SetsPage />} />
              <Route path="/cardsetcreate" element={<CardSetCreate
                                                      action={"create"}
                                                    />} />
              <Route path="/cardsets/:card_set_id" element={<SetDetailPage />} />
              <Route path="/cardsets/:card_set_id/edit" element={<CardSetCreate
                                                              action={"edit"}
                                                            />} />
              <Route path="/cardsets/:card_set_id/copy" element={<CardSetCreate
                                                              action={"edit"}
                                                              copy={true}
                                                            />} />
              <Route path="/cardsets/:card_set_id/pulls" element={<PullPage />} />
              <Route path="/pulls/deckbuilder" element={<PullsDeckBuilder />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/reset/:reset_id" element={<ResetPassword />} />
              <Route path="/forum" element={<UnderConstruction />} />
              <Route path="/game/cards" element={<GameCards />} />
              <Route path="/game/decks" element={<GameDecks />} />
              <Route path="/decks/:deck_id/deck_sheet" element={<DeckSheetPage />} />
              <Route path="/cardcategories" element={<CardCategoriesPage />} />
              <Route path="/categorycreate" element={<CardCategoriesCreate />} />
              <Route path="/cardcategories/:card_category_id" element={<CardCategoryDetail />} />
              <Route path="/cardcategories/:card_category_id/edit" element={<CardCategoryEdit />} />
              <Route path="/cardtags" element={<CardTagsPage />} />
              <Route path="/cardtagcreate" element={<CardTagCreate />} />
              <Route path="/cardtags/:card_tag_id" element={<CardTagDetails />} />
              <Route path="/cardtags/:card_tag_id/edit" element={<CardTagEdit />} />
              <Route path="/cardtypes" element={<CardTypesPage />} />
              <Route path="/cardtypecreate" element={<CardTypeCreate />} />
              <Route path="/cardtypes/:card_type_id" element={<CardTypeDetails />} />
              <Route path="/cardtypes/:card_type_id/edit" element={<CardTypeEdit />} />
              <Route path="/extraeffects" element={<ExtraEffectsPage />} />
              <Route path="/extraeffectcreate" element={<ExtraEffectCreate />} />
              <Route path="/extraeffects/:extra_effect_id/edit" element={<ExtraEffectEdit />} />
              <Route path="/extraeffects/:extra_effect_id" element={<ExtraEffectDetails />} />
              <Route path="/reactioncreate" element={<ReactionCreate />} />
              <Route path="/reactions/:reaction_id" element={<ReactionDetails />} />
              <Route path="/reactions/:reaction_id/edit" element={<ReactionEdit />} />
              <Route path="/gameplay" element={<GamePlayPage />} />
              <Route path="/reactions" element={<ReactionsPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/createportal" element={<CreatePortal />} />
              <Route path="/termcreate" element={<TermCreate />} />
              <Route path="/glossary" element={<TermsPage />} />
              <Route path="/glossary/:term_id" element={<TermEdit />} />
              <Route path="/newscreate" element={<StoryCreate />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articlecreate" element={<ArticleCreatePage />} />
              <Route path="/articles/:article_id" element={<ArticlePage />} />
              <Route path="/articles/:article_id/edit" element={<ArticleEditPage />} />
              <Route path="/howtocreate" element={<HowToCreatePage />} />
              <Route path="/rulebooks/:how_to_id" element={<HowToPage />} />
              <Route path="/rulebooks/:how_to_id/edit" element={<HowToEditPage />} />
              <Route path="/rulebooks" element={<HowTosPage />} />
            </Routes>

          </div>
        </div>
        <Footer/>
    </BrowserRouter>

    </AppProvider>
  );
}

export default App;
