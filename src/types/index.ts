import {
    User,
    Place,
    Category,
    ChatHistory,
    PlaceImage,
    UserRole,
} from "@prisma/client";

// 기본 프리즈마 타입 확장
export type UserWithRelations = User & {
    chatHistories?: ChatHistory[];
};

export type PlaceWithRelations = Place & {
    category: Category;
    images?: PlaceImage[];
    chatHistories?: ChatHistory[];
};

export type CategoryWithPlaces = Category & {
    places?: Place[];
};

export type ChatHistoryWithRelations = ChatHistory & {
    user: User;
    place?: Place;
};

// API 응답 타입
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 인증 관련 타입
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    nickname: string;
}

export interface AuthUser {
    id: string;
    email: string;
    nickname: string;
    role: UserRole;
}

// 장소 관련 타입
export interface PlaceFormData {
    name: string;
    address: string;
    phoneNumber?: string;
    description?: string;
    latitude: number;
    longitude: number;
    categoryId: string;
    imageUrl?: string;

    // 식당
    cuisine?: string;
    priceRange?: string;
    openHours?: string;

    // 명소/유적지
    historicalPeriod?: string;
    signinficance?: string;
}

export interface PlaceSearchParams {
    query?: string;
    categoryId?: string;
    latitude?: number;
    longitude?: number;
    radius?: number; // km 단위
    page?: number;
    limit?: number;
}

// 지도 관련 타입
export interface MapCenter {
    lat: number;
    lng: number;
}

export interface MapMaker {
    id: string;
    position: MapCenter;
    title: string;
    category: Category;
    place: PlaceWithRelations;
}

export interface MapBounds {
    sw: MapCenter; // 남서쪽
    ne: MapCenter; // 북동쪽
}

// 채팅 관련 타입
export interface ChatMessage {
    id: string;
    type: "user" | "bot";
    content: string;
    createdAt: Date;
    placeId?: string;
}

export interface ChatRequest {
    message: string;
    placeId?: string;
    context?: string;
}

export interface ChatResponse {
    message: string;
    suggestions?: string[];
    relatedPlaces?: PlaceWithRelations[];
}

// UI 관련 타입
export interface ModalState {
    isOpen: boolean;
    type?: "place-detail" | "chat" | "user-profile" | "auth";
    data?: any;
}

export interface ToastMessage {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    duration?: number;
}

export interface LoadingState {
    isLoading: boolean;
    message?: string;
}

// 필터 및 정렬 타입
export interface FilterOptions {
    categories: string[];
    priceRange?: string;
    distance?: number;
    rating?: number;
}

export type SortOption =
    | "name-asc"
    | "name-desc"
    | "distance-asc"
    | "created-desc"
    | "rating-desc";

// 파일 업로드 타입
export interface UploadedFile {
    url: string;
    filename: string;
    size: number;
    type: string;
}

// 설정 관련 타입
export interface AppSettings {
    theme: "light" | "dark" | "system";
    language: "ko" | "en";
    mapProvider: "kakao";
    defaultMapCenter: MapCenter;
    defaultMapZoom: number;
}

// 사용자 프로필 타입
export interface UserProfile {
    id: string;
    email: string;
    nickname: string;
    role: UserRole;
    recentChats: ChatHistory[];
    favoritePlace?: PlaceWithRelations[];
    createdAt: Date;
}

export interface UpdateProfileRequest {
    nickname?: string;
    currentPassword?: string;
    newPassword?: string;
}

// 안동 특화 타입
export enum AndongPlaceType {
    TRADITIONAL_SITE = "traditional_site", // 전통명소
    HERITAGE_SITE = "heritage_stie", // 유적지
    TRADITIONAL_FOOD = "traditional_food", // 전통 음식점
    CURTURAL_CENTER = "cultural_center", // 문화 시설
    NATURE_SPOT = "nature_spot", // 자연 명소
}

export interface AndongSpecialInfo {
    dynasty?: string; // 조선시대, 고려시대 등
    culturalValue?: string; // 문화재 등급
    seasonalInfo?: string; // 계절 정보
    festival?: string; // 관련 축제
    recommendedVisitTime?: string; // 추천 방문 시간
}

// 전역 상태 타입
export interface GlobalState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    places: PlaceWithRelations[];
    categories: Category[];
    selectedPlace: PlaceWithRelations | null;
    mapCenter: MapCenter;
    mapZoom: number;
    modal: ModalState;
    loading: LoadingState;
    toast: ToastMessage[];
    settings: AppSettings;
}

export { UserRole };
