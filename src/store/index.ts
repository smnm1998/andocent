import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
    AuthUser,
    PlaceWithRelations,
    Category,
    MapCenter,
    ModalState,
    LoadingState,
    ToastMessage,
    AppSettings,
} from "@/types";

// 인증
interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: AuthUser | null) => void;
    setLoading: (loading: boolean) => void;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isAuthenticated: false,
                isLoading: false,

                setUser: (user) =>
                    set({
                        user,
                        isAuthenticated: !!user,
                    }),

                setLoading: (isLoading) => set({ isLoading }),

                login: (user) =>
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    }),

                logout: () =>
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    }),
            }),
            {
                name: "auth-storage",
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        { name: "auth-store" }
    )
);

// 장소 데이터
interface PlaceState {
    places: PlaceWithRelations[];
    categories: Category[];
    selectedPlace: PlaceWithRelations | null;
    filteredPlaces: PlaceWithRelations[];
    searchQuery: string;
    selectedCategoryId: string | null;

    // Actions
    setPlaces: (places: PlaceWithRelations[]) => void;
    setCategories: (categories: Category[]) => void;
    setSelectedPlace: (place: PlaceWithRelations | null) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (categoryId: string | null) => void;
    addPlace: (place: PlaceWithRelations) => void;
    updatePlace: (id: string, updates: Partial<PlaceWithRelations>) => void;
    removePlace: (id: string) => void;
    filterPlaces: () => void;
}

export const usePlaceStore = create<PlaceState>()(
    devtools(
        (set, get) => ({
            places: [],
            categories: [],
            selectedPlace: null,
            filteredPlaces: [],
            searchQuery: "",
            selectedCategoryId: null,

            setPlaces: (places) => {
                set({ places });
                get().filterPlaces();
            },

            setCategories: (categories) => set({ categories }),

            setSelectedPlace: (selectedPlace) => set({ selectedPlace }),

            setSearchQuery: (searchQuery) => {
                set({ searchQuery });
                get().filterPlaces();
            },

            setSelectedCategory: (selectedCategoryId) => {
                set({ selectedCategoryId });
                get().filterPlaces();
            },

            addPlace: (place) => {
                const { places } = get();
                set({ places: [...places, place] });
                get().filterPlaces();
            },

            updatePlace: (id, updates) => {
                const { places } = get();
                const updatedPlaces = places.map((place) =>
                    place.id === id ? { ...place, ...updates } : place
                );
                set({ places: updatedPlaces });
                get().filterPlaces();
            },

            removePlace: (id) => {
                const { places } = get();
                const filteredPlaces = places.filter(
                    (place) => place.id !== id
                );
                set({ places: filteredPlaces });
                get().filterPlaces();
            },

            filterPlaces: () => {
                const { places, searchQuery, selectedCategoryId } = get();

                let filtered = places;

                // 검색어 필터링
                if (searchQuery.trim()) {
                    filtered = filtered.filter(
                        (place) =>
                            place.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            place.address
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            place.description
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            place.cuisine
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase())
                    );
                }

                // 카테고리 필터링
                if (selectedCategoryId) {
                    filtered = filtered.filter(
                        (place) => place.categoryId === selectedCategoryId
                    );
                }

                filtered = filtered.filter((place) => place.isActive);

                set({ filteredPlaces: filtered });
            },
        }),
        { name: "place-store" }
    )
);

// 지도
interface MapState {
    center: MapCenter;
    zoom: number;
    bounds: any;
    selectedMarkerId: string | null;

    // actions
    setCenter: (center: MapCenter) => void;
    setZoom: (zoom: number) => void;
    setBounds: (bounds: any) => void;
    setSelectedMarkerId: (id: string | null) => void;
    moveToPlace: (place: PlaceWithRelations) => void;
}

// 안동시청 좌표를 기본값으로 설정
const ANDONG_CENTER: MapCenter = {
    lat: 36.5684,
    lng: 128.7294,
};

export const useMapStore = create<MapState>()(
    devtools(
        (set, get) => ({
            center: ANDONG_CENTER,
            zoom: 12,
            bounds: null,
            selectedMarkerId: null,

            setCenter: (center) => set({ center }),
            setZoom: (zoom) => set({ zoom }),
            setBounds: (bounds) => set({ bounds }),
            setSelectedMarkerId: (selectedMarkerId) =>
                set({ selectedMarkerId }),
            moveToPlace: (place) => {
                set({
                    center: { lat: place.latitude, lng: place.longitude },
                    zoom: 16,
                    selectedMarkerId: place.id,
                });
            },
        }),
        { name: "map-store" }
    )
);

// UI
interface UIState {
    modal: ModalState;
    loading: LoadingState;
    toasts: ToastMessage[];
    sidebarCollapsed: boolean;

    // actions
    openModal: (type: ModalState["type"], data?: any) => void;
    closeModal: () => void;
    setLoading: (isLoading: boolean, message?: string) => void;
    addToast: (toast: Omit<ToastMessage, "id">) => void;
    removeToast: (id: string) => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        (set, get) => ({
            modal: {
                isOpen: false,
                type: undefined,
                data: undefined,
            },
            loading: {
                isLoading: false,
                message: undefined,
            },
            toasts: [],
            sidebarCollapsed: false,

            openModal: (type, data) =>
                set({
                    modal: { isOpen: true, type, data },
                }),

            closeModal: () =>
                set({
                    modal: { isOpen: false, type: undefined, data: undefined },
                }),

            setLoading: (isLoading, message) =>
                set({
                    loading: { isLoading, message },
                }),

            addToast: (toast) => {
                const id = Date.now().toString();
                const newToast = { ...toast, id };

                set((state) => ({
                    toasts: [...state.toasts, newToast],
                }));

                // 자동 제거 (duration이 설정된 경우)
                if (toast.duration && toast.duration > 0) {
                    setTimeout(() => {
                        get().removeToast(id);
                    }, toast.duration);
                }
            },

            removeToast: (id) =>
                set((state) => ({
                    toasts: state.toasts.filter((toast) => toast.id !== id),
                })),

            toggleSidebar: () =>
                set((state) => ({
                    sidebarCollapsed: !state.sidebarCollapsed,
                })),

            setSidebarCollapsed: (collapsed) =>
                set({
                    sidebarCollapsed: collapsed,
                }),
        }),
        { name: "ui-store" }
    )
);

interface ChatState {
    messages: Array<{
        id: string;
        type: "user" | "bot";
        content: string;
        timestamp: Date;
        placeId?: string;
    }>;
    isTyping: boolean;
    currentPlaceId: string | null;

    // Actions
    addMessage: (message: {
        type: "user" | "bot";
        content: string;
        placeId?: string;
    }) => void;
    clearMessages: () => void;
    setTyping: (isTyping: boolean) => void;
    setCurrentPlace: (placeId: string | null) => void;
}

export const useChatStore = create<ChatState>()(
    devtools(
        (set, get) => ({
            messages: [],
            isTyping: false,
            currentPlaceId: null,

            addMessage: (message) => {
                const newMessage = {
                    id: Date.now().toString(),
                    ...message,
                    timestamp: new Date(),
                };

                set((state) => ({
                    messages: [...state.messages, newMessage],
                }));
            },

            clearMessages: () => set({ messages: [] }),

            setTyping: (isTyping) => set({ isTyping }),

            setCurrentPlace: (currentPlaceId) => set({ currentPlaceId }),
        }),
        { name: "chat-store" }
    )
);

// 설정
interface SettingsState {
    settings: AppSettings;

    // actions
    updateSettings: (updates: Partial<AppSettings>) => void;
    resetSettings: () => void;
}

const defaultSettings: AppSettings = {
    theme: "light",
    language: "ko",
    mapProvider: "kakao",
    defaultMapCenter: ANDONG_CENTER,
    defaultMapZoom: 12,
};

export const useSettingsStore = create<SettingsState>()(
    devtools(
        persist(
            (set, get) => ({
                settings: defaultSettings,

                updateSettings: (updates) =>
                    set((state) => ({
                        settings: { ...state.settings, ...updates },
                    })),

                resetSettings: () => set({ settings: defaultSettings }),
            }),
            {
                name: "settings-storage",
            }
        ),
        { name: "settings-store" }
    )
);

// 조합 훅
export const useStores = () => ({
    auth: useAuthStore(),
    place: usePlaceStore(),
    map: useMapStore(),
    ui: useUIStore(),
    chat: useChatStore(),
    settings: useSettingsStore(),
});
