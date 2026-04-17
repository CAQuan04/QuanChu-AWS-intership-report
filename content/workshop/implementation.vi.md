## Thiết lập Frontend


## ReactNative & Expo

Để thuận tiện cho việc thực hành, phần Frontend đã được chuẩn bị sẵn dưới dạng skeleton code hoàn chỉnh về giao diện và store. Bạn sẽ tiến hành tải mã nguồn và chuẩn bị môi trường chạy.

```text
frontend/
  app/                     # Expo Router — every file is a route
    _layout.tsx            # Root: LanguageProvider, GestureHandlerRootView, auth guard
    (tabs)/
      _layout.tsx          # Tab bar with 6 tabs + center "+" button
      home.tsx             # Dashboard: daily macros, streak, Ollie pet
      kitchen.tsx          # Fridge inventory + AI recipe suggestions
      battle.tsx           # Friend leaderboard + challenges
      ai-coach.tsx         # Chat with Ollie
      progress.tsx         # Weekly/monthly nutrition charts
      add.tsx              # Food logging: photo, voice, manual
    welcome.tsx            # Onboarding / landing
    login.tsx              # Email+password + Google OAuth
    signup.tsx             # Registration form
    verify-otp.tsx         # Email OTP verification
  src/
    store/                 # Zustand stores (authStore, userStore, mealStore, ...)
    services/              # Business logic (authService, aiService, audioService, ...)
    lib/amplify.ts         # Amplify.configure() — import as side-effect in _layout
    i18n/                  # LanguageProvider + translations (vi/en)
    security/              # Biometric auth, screen capture prevention, input validation
    constants/             # colors.ts, typography.ts
  assets/                  # Images, fonts
  MANHINH/                 # Pet evolution videos 1.mp4–5.mp4
  amplify_outputs.json     # Auto-generated per environment — do NOT edit manually
  package.json
  .npmrc                   # legacy-peer-deps=true
```

## 1. Tải mã nguồn (Clone Repository)

Mở terminal tại thư mục làm việc của bạn và chạy lệnh:

```bash
git clone https://github.com/NeuraX-HQ/neurax-web-app.git
cd neurax-web-app
```

## 2. Cài đặt thư viện (npm install)

Cài đặt các phụ thuộc cần thiết cho Expo và xác thực:

```bash
cd frontend
npm install
```

## 3. Chạy ứng dụng với Expo

Khởi động môi trường phát triển:

```bash
npx expo start
```

Tại đây, bạn sẽ thấy một mã QR. Sử dụng điện thoại đã cài **Expo Go** để quét mã này. 

{{% notice info %}}
Màn hình sẽ hiển thị thông báo lỗi kết nối Backend hoặc lỗi Config — điều này hoàn toàn bình thường vì chúng ta chưa triển khai hạ tầng Amplify ở bước tiếp theo.
{{% /notice %}}

---

[Tiếp tục đến 5.4 Thiết lập Backend](../5.4-Backend/)


## Thiết lập AWS Amplify Gen 2


Chúng ta sẽ khởi tạo trái tim dữ liệu của NutriTrack bằng mã nguồn TypeScript.

## 1. Khởi tạo Thư mục Backend

Tạo một thư mục riêng biệt để quản lý hạ tầng:

```bash
cd neurax-web-app
mkdir backend
cd backend
```
## 2. Cài đặt Phụ lục

```bash
npm create amplify@latest --yes
npm install
```

## 3. Triển khai Sandbox (Lần đầu)

Sử dụng Amplify CLI (Gen 2) để khởi tạo dự án và triển khai môi trường Sandbox cá nhân:

```bash
npx ampx pipeline-deploy --branch main --app-id [YOUR_APP_ID]

# Hoặc chạy lệnh sau để làm việc local:
npx ampx sandbox
```
![ampx-sandbox-start.png](/images/ampx-sandbox-start.png)

---

## Chi tiết các lớp tài nguyên:

Bây giờ, chúng ta sẽ lần lượt định nghĩa các tệp cấu hình cốt lõi nằm trong thư mục `amplify/`:

1. [Lớp Xác thực (Auth)](5.4.1-Auth/)
2. [Lớp Dữ liệu (Data)](5.4.2-Data/)
3. [Lớp Lưu trữ (Storage)](5.4.3-Storage/)
4. [Các hàm Logic (Functions)](5.4.4-Functions/)

---

[Tiếp tục đến 5.5 Tầng Container ECS](../5.5-ECS-Fargate/)


## 


# Lớp Xác thực 

Sử dụng Amazon Cognito để quản lý danh tính người dùng.

## Cấu hình `auth/resource.ts`

Chúng ta cấu hình đăng nhập bằng Email kết hợp với Google OAuth2.

```typescript
import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({

  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile', 'openid']
      },
      callbackUrls: [
        'nutritrack://',
        'http://localhost:8081/',
        'https://nutri-track.link/',
        'https://feat-phase3-frontend-integration.d1glc6vvop0xlb.amplifyapp.com/'
      ],
      logoutUrls: [
        'nutritrack://',
        'http://localhost:8081/',
        'https://nutri-track.link/',
        'https://feat-phase3-frontend-integration.d1glc6vvop0xlb.amplifyapp.com/'
      ]
    }
  },

  userAttributes: {
    email: {
      required: true
    },
    preferredUsername: {
      required: false
    }
  },
});

```

---

## Thiết lập Secret cho Google OAuth

Vì chúng ta sử dụng `secret()` trong mã nguồn, bạn cần nạp các giá trị này vào AWS Amplify trước khi triển khai. Chạy các lệnh sau trong terminal tại thư mục backend:

```bash
npx ampx secret set GOOGLE_CLIENT_ID
npx ampx secret set GOOGLE_CLIENT_SECRET
```

Hệ thống sẽ yêu cầu bạn nhập giá trị cho từng biến (lấy từ Google Cloud Console).

![cognito-user-pool.png](/images/cognito-user-pool.png)

---

[Tiếp tục đến 5.4.2 Lớp Dữ liệu (Data)](../5.4.2-Data/)


## Lớp Dữ liệu


# AppSync & DynamoDB

Định nghĩa lược đồ dữ liệu (Schema) và các quy tắc truy cập.

## Cấu hình `data/resource.ts`

Chúng ta định nghĩa các model chính phục vụ cho ứng dụng.

```typescript
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { aiEngine } from '../ai-engine/resource';
import { scanImage } from '../scan-image/resource';
import { processNutrition } from '../process-nutrition/resource';
import { friendRequest } from '../friend-request/resource';


const schema = a.schema({
  //========================================
  // Food Database
  //========================================
  Portions: a.customType({
    small: a.float(),
    medium: a.float(),
    large: a.float(),
  }),

  Serving: a.customType({
    default_g: a.float(),
    unit: a.string(),
    portions: a.ref('Portions'),
  }),

  Micronutrients: a.customType({
    calcium_mg: a.float(),
    iron_mg: a.float(),
    vitamin_a_ug: a.float(),
    vitamin_c_mg: a.float(),
  }),

  Macros: a.customType({
    calories: a.float(),
    protein_g: a.float(),
    carbs_g: a.float(),
    fat_g: a.float(),
    saturated_fat_g: a.float(),
    polyunsaturated_fat_g: a.float(),
    monounsaturated_fat_g: a.float(),
    fiber_g: a.float(),
    sugar_g: a.float(),
    sodium_mg: a.float(),
    cholesterol_mg: a.float(),
    potassium_mg: a.float(),
  }),

  Food: a
    .model({
      food_id: a.string().required(),
      name_vi: a.string().required(),
      name_en: a.string(),
      aliases_vi: a.string().array(),
      aliases_en: a.string().array(),
      macros: a.ref('Macros'),
      micronutrients: a.ref('Micronutrients'),
      serving: a.ref('Serving'),
      verified: a.boolean(),
      source: a.string(),
    })
    .identifier(['food_id'])
    .secondaryIndexes((index) => [
      index('name_vi'),
      index('name_en'),
    ])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read'])
    ]),

  //========================================
  // User Database
  //========================================
  biometric: a.customType({
    age: a.integer(),
    gender: a.string(),
    height_cm: a.float(),
    weight_kg: a.float(),
    active_level: a.string(),
  }),

  goal: a.customType({
    daily_calories: a.float(),
    daily_carbs_g: a.float(),
    daily_protein_g: a.float(),
    daily_fat_g: a.float(),
    target_weight_kg: a.float(), 
  }),

  dietary_profile: a.customType({
    allergies: a.string().array(),
    preferences: a.string().array(),
  }),

  gamification: a.customType({
    current_streak: a.integer(),
    longest_streak: a.integer(),
    last_log_date: a.string(),
    total_points: a.integer(),
  }),

  ai_preferences: a.customType({
    coach_tone: a.string(),
  }),

  user: a
    .model({
      user_id: a.string().required(),
      email: a.string().required(),
      display_name: a.string(),
      avatar_url: a.string(),
      created_at: a.string(),
      updated_at: a.string(),
      last_active_at: a.string(),
      onboarding_status: a.boolean(),
      friend_code: a.string(),
      ai_context_summary: a.string(),
      biometric: a.ref('biometric'),
      goal: a.ref('goal'),
      dietary_profile: a.ref('dietary_profile'),
      gamification: a.ref('gamification'),
      ai_preferences: a.ref('ai_preferences'),
    })
    .identifier(['user_id'])
    .secondaryIndexes((index) => [
      index('friend_code'),
    ])
    .authorization((allow) => [
      allow.owner(),
    ]),


  //========================================
  // Food Logs (Meal History)
  //========================================
  LogMacros: a.customType({
    calories: a.float(),
    protein_g: a.float(),
    carbs_g: a.float(),
    fat_g: a.float(),
    fiber_g: a.float(),
    sugar_g: a.float(),
    sodium_mg: a.float(),
  }),

  LogIngredient: a.customType({
    name: a.string(),
    weight_g: a.float(),
  }),

  FoodLog: a
    .model({
      date: a.string().required(),
      timestamp: a.datetime().required(),
      food_id: a.string(),
      food_name: a.string().required(),
      meal_type: a.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      portion: a.float(),
      portion_unit: a.string(),
      additions: a.string().array(),
      ingredients: a.json().array(),
      macros: a.ref('LogMacros'),
      micronutrients: a.ref('Micronutrients'),
      input_method: a.enum(['voice', 'photo', 'manual', 'barcode']),
      image_key: a.string(),
    })
    .secondaryIndexes((index) => [
      index('date'),
    ])
    .authorization((allow) => [
      allow.owner(),
    ]),

  //========================================
  // Fridge Inventory
  //========================================
  FridgeItem: a
    .model({
      name: a.string().required(),
      food_id: a.string(),
      quantity: a.float(),
      unit: a.string(),
      added_date: a.datetime(),
      expiry_date: a.string(),
      category: a.enum(['meat', 'vegetable', 'fruit', 'dairy', 'pantry', 'other']),
      emoji: a.string(),
      calories: a.float(),
      protein_g: a.float(),
      carbs_g: a.float(),
      fat_g: a.float(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),

//========================================
  // Friendships
  //========================================
  Friendship: a
    .model({
      friend_id: a.string().required(),
      friend_code: a.string(),
      friend_name: a.string(),
      friend_avatar: a.string(),
      status: a.enum(['pending', 'accepted', 'blocked']),
      direction: a.enum(['sent', 'received']),
      linked_id: a.string(),
    })
    .secondaryIndexes((index) => [
      index('friend_id'),
    ])
    .authorization((allow) => [
      allow.owner(),
    ]),

  //========================================
  // User Public Stats (readable by friends)
  //========================================
  UserPublicStats: a
    .model({
      user_id: a.string().required(),
      display_name: a.string(),
      avatar_url: a.string(),
      current_streak: a.integer(),
      longest_streak: a.integer(),
      pet_score: a.integer(),
      pet_level: a.integer(),
      total_log_days: a.integer(),
      last_log_date: a.string(),
    })
    .identifier(['user_id'])
    .authorization((allow) => [
      allow.owner().to(['create', 'update', 'delete', 'read']),
      allow.authenticated().to(['read']),
    ]),

  //========================================
  // AI Engine (Bedrock)
  //========================================
  aiEngine: a
    .query()
    .arguments({
      action: a.string().required(),
      payload: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(aiEngine))
    .authorization((allow) => [allow.authenticated()]),

  //========================================
  // Scan Image (proxy to ECS for photo analysis)
  //========================================
  scanImage: a
    .query()
    .arguments({
      action: a.string().required(),
      payload: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(scanImage))
    .authorization((allow) => [allow.authenticated()]),

  //========================================
  // Process Nutrition (DB verify + AI fallback)
  //========================================
  processNutrition: a
    .query()
    .arguments({ payload: a.string().required() })
    .returns(a.string())
    .handler(a.handler.function(processNutrition))
    .authorization((allow) => [allow.authenticated()]),

  //========================================
  // Friend Request (send/accept/decline/remove/block)
  //========================================
  friendRequest: a
    .mutation()
    .arguments({
      action: a.string().required(),
      payload: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(friendRequest))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
```

![appsync-console-schema.png](/images/appsync-console-schema.png)
![appsync-queries-playground.png](/images/appsync-queries-playground.png)

![food-item-structure.png](/images/food-item-structure.png)
![dynamodb-tables-list.png](/images/dynamodb-tables-list.png)

---

[Tiếp tục đến 5.4.3 Lớp Lưu trữ (Storage)](../5.4.3-Storage/)


## 


# Lớp Lưu trữ — Amazon S3

Quản lý hình ảnh và các tệp phương tiện.

## Cấu hình `storage/resource.ts`

Chúng ta phân chia S3 bucket thành các khu vực truy cập khác nhau dựa trên tiền tố (Prefix).

```typescript
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'nutritrack_media_bucket',
  access: (allow) => ({
    // Khu vực hạ cánh (Landing Zone) - User upload trực tiếp vào đây
    'incoming/{entity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // Voice recordings - tạm lưu để Transcribe xử lý (ephemeral, Lambda xóa sau khi xong)
    'voice/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],

    'avatar/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    // Khu vực lưu trữ vĩnh viễn (Trusted Zone) - Lambda sẽ lưu kết quả tại đây
    'media/{entity_id}/*': [
      allow.authenticated.to(['read', 'delete'])
    ]
  })
});
```

![s3-bucket-console.png](/images/s3-bucket-console.png)
![s3-prefixes.png](/images/s3-prefixes.png)

---

[Tiếp tục đến 5.4.4 Các hàm Logic (Functions)](../5.4.4-Functions/)


## Các hàm Logic (Functions)


## Các hàm chính trong dự án

### 1. `ai-engine` — Bộ não AI
Sử dụng SDK của Amazon Bedrock để gọi mô hình Qwen3-VL.
- **Thư mục**: `amplify/ai-engine/`

### 2. `scan-image` — Phân tích Hình ảnh (Proxy)
Đóng vai trò trung gian gửi yêu cầu tới tầng ECS Fargate.
- **Thư mục**: `amplify/scan-image/`

### 3. `process-nutrition` — Xử lý Dinh dưỡng
Tính toán Macros từ kết quả AI và ghi vào DynamoDB.
- **Thư mục**: `amplify/process-nutrition/`

### 4. `resize-image` — Tối ưu Hình ảnh
Sử dụng thư viện `sharp` (qua Lambda Layer) để tạo Thumbnail.
- **Thư mục**: `amplify/resize-image/`

### 5. `friend-request` — Hệ thống Kết bạn
Xử lý các Mutation yêu cầu kết bạn và cập nhật bảng Friendship.
- **Thư mục**: `amplify/friend-request/`

## Cách định nghĩa Function trong Amplify Gen 2

Trong Amplify Gen 2, mỗi Lambda function thường bao gồm hai tệp cốt lõi nằm trong thư mục riêng của nó (ví dụ: `amplify/my-func/`):

1.  **`resource.ts`**: Định nghĩa tài nguyên (tên, thời gian timeout, bộ nhớ, quyền truy cập).
2.  **`handler.ts`**: Chứa mã nguồn thực thi chính của hàm.

### Quy trình tạo một hàm mới:
1.  Tạo thư mục: `mkdir -p amplify/[tên-hàm]`
2.  Tạo tệp `resource.ts` để cấu hình function.
3.  Tạo tệp `handler.ts` để viết logic.
4.  Export function vào tệp `amplify/backend.ts`.

---

## Chi tiết mã nguồn các hàm:

Dưới đây là mã nguồn skeleton cho từng hàm. Bạn hãy tạo các tệp tương ứng và dán mã nguồn thực tế của mình vào:

1. [Function ai-engine (Bedrock)](5.4.4.1-AIEngine/)
2. [Function scan-image (ECS Proxy)](5.4.4.2-ScanImage/)
3. [Function process-nutrition (Logic & DB)](5.4.4.3-ProcessNutrition/)
4. [Function friend-request (Social logic)](5.4.4.4-FriendRequest/)
5. [Function resize-image (S3 Trigger & Sharp)](5.4.4.5-ResizeImage/)

---

[Tiếp tục đến 5.5 Tầng Container ECS](../5.5-ECS-Fargate/)


## Function ai-engine (Bedrock)


Hàm này đóng vai trò là "bộ não" của ứng dụng, chịu trách nhiệm tương tác với **Amazon Bedrock** để phân tích ngôn ngữ tự nhiên và hình ảnh.

### 1. Cài đặt thư viện (npm install)

Di chuyển vào thư mục của hàm và cài đặt các SDK cần thiết:

```bash
cd amplify/ai-engine
npm install
```

### 2. Cấu hình Tài nguyên (`resource.ts`)

Tệp này định nghĩa các thuộc tính cơ bản và quyền hạn của Lambda.

```typescript
import { defineFunction } from '@aws-amplify/backend';

export const aiEngine = defineFunction({
  name: 'ai-engine',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 512,
  timeoutSeconds: 120, // voiceToFood: Transcribe polling + Bedrock can exceed 60s
  resourceGroupName: 'data',
});

```

### 2. Mã nguồn xử lý (`handler.ts`)

Dưới đây là khung mã nguồn cơ bản để bạn dán code xử lý Bedrock vào.

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand, DeleteTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const REGION = "ap-southeast-2";
const bedrockClient = new BedrockRuntimeClient({ region: REGION });
const transcribeClient = new TranscribeClient({ region: REGION });
const s3Client = new S3Client({ region: REGION });
const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

const QWEN_MODEL_ID = process.env.QWEN_MODEL_ID || "qwen.qwen3-vl-235b-a22b";
const STORAGE_BUCKET = process.env.STORAGE_BUCKET_NAME || "";
const IS_DEBUG = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

// Simple debug logger - respects DEBUG env var
const debug = (message: string, data?: any) => {
  if (IS_DEBUG) {
    console.log(`[ai-engine] ${message}`, data || "");
  }
};

// ═══════════════════════════════════════════════════════════════
// PROMPTS (from docs/prompts)
// ═══════════════════════════════════════════════════════════════

const GEN_FOOD_SYSTEM_PROMPT = `You are Ollie, an expert AI nutrition assistant for the NutriTrack app.
A user has searched for a food, dish, or meal that is NOT in our local database, or provided an image. Your job is to analyze the food and estimate its ingredients, standard portion size, macros, and micronutrients.

RULES:
1. Break down the meal into its core raw ingredients. (e.g., "Boiled Potatoes and Pan seared chicken" -> Potatoes, Chicken Breast, Olive Oil, etc.).
2. Estimate a standard, medium portion size for the ENTIRE dish/meal.
3. Provide estimated macros and micronutrients reflecting that portion size.
4. CALORIES: Ensure (Protein*4 + Carbs*4 + Fat*9) roughly matches the total calories.
5. Provide the food name and ingredients in BOTH Vietnamese (name_vi) and English (name_en).
6. Tone: Vietnamese casual (ê, nhé, nha), encouraging, practical. Use emojis sparingly (💪🔥).
7. Output STRICT JSON format only. NO markdown blocks (\`\`\`json), no conversational text.

EDGE CASE:
- If the input is clearly NOT a food, beverage, or edible item: return exactly:
{"error": "not_food", "message_vi": "Vui lòng nhập một món ăn hoặc nguyên liệu hợp lệ.", "message_en": "Please enter a valid food or ingredient."}

OUTPUT SCHEMA:
{
  "food_id": "custom_gen_temp",
  "name_vi": "Tên tiếng Việt",
  "name_en": "English Name",
  "macros": { "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "saturated_fat_g": 0, "polyunsaturated_fat_g": 0, "monounsaturated_fat_g": 0, "fiber_g": 0, "sugar_g": 0, "sodium_mg": 0, "cholesterol_mg": 0, "potassium_mg": 0 },
  "micronutrients": { "calcium_mg": 0, "iron_mg": 0, "vitamin_a_ug": 0, "vitamin_c_mg": 0 },
  "serving": { "default_g": 0, "unit": "bowl | plate | serving | piece", "portions": { "small": 0.7, "medium": 1.0, "large": 1.3 } },
  "ingredients": [ { "name_vi": "Tên nguyên liệu", "name_en": "Ingredient Name", "weight_g": 0 } ],
  "verified": false, "source": "AI Generated"
}`;

const FIX_FOOD_SYSTEM_PROMPT = `You are Ollie, an expert AI nutritionist for NutriTrack.
Your task is to correct a logged food item based on user instructions.

RULES:
1. ARITHMETIC: If ingredients or weights change, recalculate ALL macros/micronutrients.
2. CALORIES: Ensure (Protein*4 + Carbs*4 + Fat*9) roughly matches the new total.
3. PERSONALITY: Professional, polite, and helpful nutritionist (tư vấn viên dinh dưỡng lịch sự, chuyên nghiệp).
4. Output STRICT JSON format only. NO markdown blocks (\`\`\`json).

EDGE CASE:
- If request is nonsense/non-food: return {"error": "not_food", "message_vi": "Vui lòng nhập yêu cầu sửa món chính xác để Ollie có thể hỗ trợ bạn nhé!", "message_en": "Please enter a valid correction request!"}

OUTPUT SCHEMA: Same as GEN_FOOD (with "source": "AI Fixed").`;

const VOICE_SYSTEM_PROMPT = `You are Ollie, an expert AI nutrition assistant for NutriTrack.
You understand both Vietnamese (casual) and English.

YOUR TASK:
When the user describes a meal, a specific dish, or just raw ingredients via voice or text, analyze the components and log it. Even if the user is vague, you MUST estimate the nutritional profile.

RULES:
1. DETECT language (vi or en).
2. IDENTIFY items: Can be a complete dish (e.g., "Phở bò") or raw ingredients (e.g., "200g thịt bò").
3. ESTIMATION: You MUST estimate standard portions if not provided and provide nutritional breakdown (macros) for the entire input and each ingredient/item. Never return 0 for macros unless the item has no calories.
4. PORTION: small | medium | large. Default: "medium".
5. RESPONSE: If user speaks Vietnamese → respond/clarify in polite and professional Vietnamese (lịch sự, rõ ràng). Avoid casual particles like 'ê', 'nha', 'nè'.
6. Output STRICT JSON format only. NO markdown blocks (\`\`\`json).

ERROR HANDLING:
- Unintelligible or Non-food input: return action="clarify". NEVER log non-food items.
- Example: "Cho tớ cái máy bay" -> action="clarify", clarification_question_vi="Món này không thể tiêu thụ được, quý khách vui lòng chọn món ăn khác nhé!"

OUTPUT SCHEMA:
{
  "action": "log" | "clarify",
  "detected_language": "vi" | "en",
  "meal_type": "breakfast | lunch | dinner | snack",
  "confidence": 0.0 to 1.0,
  "clarification_question_vi": "Câu hỏi tiếng Việt hoặc null",
  "clarification_question_en": "English question or null",
  "food_data": {
      "food_id": "custom_gen_temp",
      "name_vi": "Tên món/nguyên liệu", "name_en": "Dish/Ingredient Name",
      "macros": { "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "saturated_fat_g": 0, "fiber_g": 0, "sugar_g": 0, "sodium_mg": 0 },
      "serving": { "default_g": 0, "unit": "bowl | plate | piece | g | ml", "portions": {"small": 0.7, "medium": 1.0, "large": 1.3} },
      "ingredients": [ {"name_vi": "tên nguyên liệu", "name_en": "ingredient name", "weight_g": 0, "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0} ]
  }
}`;

const OLLIE_COACH_SYSTEM_PROMPT = `You are Ollie, a Vietnamese AI nutrition coach in the NutriTrack app.

PERSONALITY:
- 👔 Professional, polite, and encouraging health consultant.
- 💪 Motivating and providing scientific-backed evidence.
- 🌐 LANGUAGE: Follow the user's language. If they speak English, reply in English. If they speak Vietnamese, reply in professional and respectful Vietnamese.
- 🎯 Actionable: give specific, practical advice.
- ✨ Celebrate milestones with a supportive tone.

RULES:
1. MAX 2 sentences per response. Short and punchy.
2. Use 1-2 emojis max. Don't overdo it.
3. Reference the user's ACTUAL data (streak, calories, protein).
4. Be specific: "ăn thêm 2 trứng luộc" not "ăn thêm protein".
5. Output STRICT JSON format only. NO markdown blocks (\`\`\`json), no conversational text.

EDGE CASE:
- If stats are missing or absurd, provide a generic encouraging message. skip specific numbers.

OUTPUT FORMAT — always return a single JSON object:
{
  "tip_vi": "Lời khuyên của Ollie (Vietnamese casual)",
  "tip_en": "Ollie's tip in English (energetic)",
  "mood": "celebrate | encourage | suggest | neutral",
  "suggested_food_vi": "Món gợi ý (nếu có)",
  "suggested_food_en": "Suggested food (if any)"
}`;

const RECIPE_SYSTEM_PROMPT = `You are Ollie, a Vietnamese cooking coach in the NutriTrack app.

YOUR TASK:
Suggest 1-3 recipes based on fridge inventory and goals.

RULES:
1. USE EXPIRING ITEMS FIRST — essential for food waste reduction.
2. NUTRITION GOAL: high_protein | low_carb | balanced | low_calorie.
3. REALISTIC: Home-cookable in ≤45 minutes.
4. TONE: Professional, encouraging, and respectful (lịch sự, hướng dẫn tận tình).
5. Output STRICT JSON format only. NO markdown blocks (\`\`\`json).

EDGE CASE:
- If inventory is non-food: return {"recipes": [], "overall_tip_vi": "Mình chỉ giúp tạo công thức nấu ăn thui nha! 🍳", "overall_tip_en": "I can only help with recipes! 🍳", "error": "not_food"}.

OUTPUT SCHEMA:
{
  "recipes": [
    {
      "dish_name_vi": "Tên món", "dish_name_en": "Dish Name",
      "why_this_vi": "Lý do chọn cực thuyết phục", "why_this_en": "Why this dish",
      "cooking_time_min": 30, "difficulty": "easy | medium | hard",
      "ingredients_from_fridge": [ {"name": "thịt", "weight_g": 200} ],
      "need_to_buy": ["nước mắm"],
      "macros": {"calories": 420, "protein_g": 35, "carbs_g": 30, "fat_g": 18},
      "steps_vi": ["Bước 1: ..."], "steps_en": ["Step 1: ..."],
      "tip_vi": "Mẹo nấu", "tip_en": "Cooking tip"
    }
  ],
  "overall_tip_vi": "Lời khuyên tổng quát", "overall_tip_en": "Overall tip"
}`;

const MACRO_CALCULATOR_SYSTEM_PROMPT = `You are Ollie, an expert AI nutritionist for NutriTrack.
Calculate daily targets based on biometrics, goals, and lifestyle.

RULES:
1. CALCULATION: Use Mifflin-St Jeor for TDEE.
2. GOALS: Deficit (-500) for weight loss, Surplus (+300) for gain.
3. MACROS: Ensure (Protein*4 + Carbs*4 + Fat*9) equals daily_calories.
4. TONE: Professional and encouraging health consultant. Avoid casual Gen-Z slang.
5. Output STRICT JSON format only. NO markdown blocks (\`\`\`json).

EDGE CASE:
- If biometrics are absurd: return 2000 cal default and ask to update profile "để thông tin chính xác hơn".

OUTPUT SCHEMA:
{
  "daily_calories": 2000,
  "daily_protein_g": 150, "daily_carbs_g": 150, "daily_fat_g": 65,
  "reasoning_vi": "Lý do tính toán (lịch sự, rõ ràng)",
  "reasoning_en": "Calculation reasoning (professional)"
}`;

const WEEKLY_INSIGHT_SYSTEM_PROMPT = `You are Ollie, an expert AI nutritionist and Gen-Z coach for NutriTrack.
Analyze user food logs and biometrics to provide a "Weekly Insight".

RULES:
1. PROGRESS: Acknowledge wins, identify one key pattern.
2. ADVICE: One clear, easyToAction tip for next week.
3. TONE: Professional, supportive, and informative. Avoid slang like 'á', 'nhen', 'xịn'.
4. LENGTH: Exactly 3 sentences.
5. Output STRICT JSON format only. NO markdown blocks (\`\`\`json).

OUTPUT SCHEMA:
{
  "insight_vi": "Nhận xét tuần này bằng tiếng Việt (chuyên nghiệp)",
  "insight_en": "Insight in English (professional)",
  "status": "success | insufficient_data"
}`;

const AI_COACH_SYSTEM_PROMPT = `You are Ollie, a professional Vietnamese AI health and nutrition consultant for NutriTrack.
You are a knowledgeable advisor who is polite, respectful, and evidence-based. Avoid casual slang or acting like a Gen-Z peer.

SCOPE:
- Nutrition, food, healthy eating, exercise, health stats, wellness.
- Politely decline off-topic questions (e.g. "Món này không thể tiêu thụ được, quý khách vui lòng chọn món ăn khác nhé!").

TONE:
- Respectful and warm Vietnamese: dùng "bạn" / "mình", tránh tiếng lóng Gen-Z.
- Professional but approachable — như một chuyên gia dinh dưỡng tận tâm, không phải bạn bè ngang hàng.
- Ngắn gọn, tập trung vào điều người dùng thực sự hỏi.
- Khuyến khích nhẹ nhàng, không phán xét.

RULES:
1. LANGUAGE: You MUST match the user's language prefix from the prompt below. This rule is absolute.
2. MEAL SUGGESTION: Suggest 1-3 meals. Prioritize expiring items from fridge.
3. CONTEXT RULES: Use USER CONTEXT data ONLY when the user asks about nutrition/meals/health/progress. For casual conversation (greetings, small talk), respond naturally without mentioning stats or numbers.
4. CARDS: Use specific delimiters (===FOOD_CARD_START=== etc.) placed at the end.
5. Reply in natural conversational text. NEVER output raw JSON objects in the message body.
6. NEVER use markdown code fences (\`\`\`json, \`\`\`, etc.). Write plain text only.
7. NEVER expose internal data structures, field names, or API responses to the user.

CARD TEMPLATES (Place at the END of response):

===FOOD_CARD_START===
{"name": "Tên món", "description": "Lý do chọn", "calories": 450, "protein_g": 30, "carbs_g": 40, "fat_g": 10, "time": "25 phút", "emoji": "🍱", "ingredients": [{"name": "Gạo", "amount": "1 chén"}], "steps": [{"title": "Nấu cơm", "instruction": "Vo gạo nấu"}]}
===FOOD_CARD_END===

===EXERCISE_CARD_START===
{"name": "Tên bài tập", "description": "Ưu điểm", "duration_minutes": 30, "calories_burned": 250, "emoji": "🏃"}
===EXERCISE_CARD_END===

===STATS_CARD_START===
{"calories_consumed": 1800, "calories_target": 2000, "protein_g": 85, "carbs_g": 210, "fat_g": 60, "summary": "Ngon lành! Ráng ăn thêm đạm nhé."}
===STATS_CARD_END===

Append this at the very end of your message: "Ghi chú: Thông tin công thức/dinh dưỡng chỉ mang tính tham khảo, bạn có thể tùy chỉnh để phù hợp với khẩu vị cá nhân."`;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

async function waitForTranscription(jobName: string): Promise<string> {
    for (let i = 0; i < 25; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const result = await transcribeClient.send(new GetTranscriptionJobCommand({ TranscriptionJobName: jobName }));
        const status = result.TranscriptionJob?.TranscriptionJobStatus;

        if (status === 'COMPLETED') {
            const transcriptUri = result.TranscriptionJob?.Transcript?.TranscriptFileUri;
            if (!transcriptUri) throw new Error('No transcript URI');
            const res = await fetch(transcriptUri);
            const json = await res.json();
            return json.results?.transcripts?.[0]?.transcript || '';
        }
        if (status === 'FAILED') {
            throw new Error(`Transcription failed: ${result.TranscriptionJob?.FailureReason}`);
        }
    }
    throw new Error('Transcription timed out');
}

async function callQwen(messages: any[], maxTokens = 1000): Promise<string> {
    const body = JSON.stringify({ messages, max_tokens: maxTokens });
    const command = new InvokeModelCommand({
        modelId: QWEN_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body,
    });
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    const text: string = responseBody.choices?.[0]?.message?.content
        || responseBody.output?.message?.content?.[0]?.text
        || responseBody.content?.[0]?.text
        || '';
    if (!text) {
        debug('Empty Qwen response. Raw body:', JSON.stringify(responseBody).slice(0, 500));
    }
    return text;
}

// ═══════════════════════════════════════════════════════════════
// HANDLER
// ═══════════════════════════════════════════════════════════════

export const handler = async (event: any) => {
    const { action, payload } = event.arguments || {};

    try {
        const data = payload ? JSON.parse(payload) : {};

        // ── Image Analysis (Qwen3-VL vision) ──
        if (action === 'analyzeFoodImage') {
            const { s3Key } = data;
            if (!STORAGE_BUCKET) throw new Error('STORAGE_BUCKET_NAME not configured');
            if (!s3Key || s3Key.includes('..')) throw new Error('Invalid s3Key');

            // Read image from S3, convert to base64 (avoids large payload through AppSync)
            const s3Obj = await s3Client.send(new GetObjectCommand({ Bucket: STORAGE_BUCKET, Key: s3Key }));
            const chunks: Uint8Array[] = [];
            for await (const chunk of s3Obj.Body as any) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            const base64 = imageBuffer.toString('base64');
            const contentType = s3Obj.ContentType || 'image/jpeg';

            const text = await callQwen([
                { role: "system", content: GEN_FOOD_SYSTEM_PROMPT },
                {
                    role: "user",
                    content: [
                        { type: "image_url", image_url: { url: `data:${contentType};base64,${base64}` } },
                        { type: "text", text: "Analyze this food image and estimate its nutritional profile. Use Vietnamese (tiếng Việt) for name_vi and all ingredient name_vi fields. Return ONLY the JSON object." },
                    ],
                },
            ]);

            // File stays in incoming/ for food-detail display.
            // S3 lifecycle rule (expirationInDays: 1 on incoming/) handles cleanup automatically.
            return JSON.stringify({ success: true, text });
        }

        // ── Conversational AI Coach ──
        if (action === 'generateCoachResponse') {
            const { userMessage, chatHistory, contextString } = data;

            // Deterministic language detection: check for Vietnamese diacritical marks.
            // This is far more reliable than asking the model to detect language from a
            // mixed context that contains Vietnamese food names.
            const VI_PATTERN = /[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹỵ]/i;
            const isVietnamese = VI_PATTERN.test(userMessage);
            const detectedLang = isVietnamese ? 'vi' : 'en';
            const langInstruction = detectedLang === 'vi'
                ? 'MANDATORY: Reply ENTIRELY in Vietnamese (professional and polite: nhé, vui lòng). Do NOT use casual slang or Gen-Z particles like "ê", "nha", "nè", "á".'
                : 'MANDATORY: Reply ENTIRELY in English. Do NOT use any Vietnamese words, even in food names.';

            const messages: any[] = [
                { role: "system", content: AI_COACH_SYSTEM_PROMPT },
            ];
            for (const msg of chatHistory) {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.parts[0].text
                });
            }
            // Context as system message so food names don't skew language detection.
            if (contextString) {
                messages.push({
                    role: "system",
                    content: `USER CONTEXT (background data only):\n${contextString}`
                });
            }
            // Explicit language instruction as final system message — overrides everything.
            messages.push({
                role: "system",
                content: langInstruction
            });
            messages.push({
                role: "user",
                content: userMessage
            });

            const text = await callQwen(messages, 2000);
            return JSON.stringify({ success: true, text });
        }

        // ── Food Search / Generation (DB miss → AI) ──
        if (action === 'generateFood') {
            const { foodName } = data;
            const text = await callQwen([
                { role: "system", content: GEN_FOOD_SYSTEM_PROMPT },
                { role: "user", content: `Analyze the following unknown food and estimate its nutritional profile:\nFood Query: "${foodName}"\n\nReturn ONLY the JSON object.` },
            ]);
            return JSON.stringify({ success: true, text });
        }

        // ── Fix/Correct a Food Item ──
        if (action === 'fixFood') {
            const { currentFoodJson, correctionQuery } = data;
            const text = await callQwen([
                { role: "system", content: FIX_FOOD_SYSTEM_PROMPT },
                { role: "user", content: `Please fix the following food item based on the user's request:\n\nCurrent Food Data:\n${JSON.stringify(currentFoodJson, null, 2)}\n\nCorrection Request: "${correctionQuery}"\n\nReturn ONLY the new JSON object.` },
            ]);
            return JSON.stringify({ success: true, text });
        }

        // ── Voice → Food (Transcribe + Qwen) ──
        if (action === 'voiceToFood') {
            const { s3Key } = data;
            if (!STORAGE_BUCKET) throw new Error('STORAGE_BUCKET_NAME not configured');
            if (!s3Key || !s3Key.startsWith('voice/') || s3Key.includes('..')) {
                throw new Error('Invalid s3Key');
            }

            const jobName = `nutritrack-voice-${randomUUID()}`;

            // Map file extension → AWS Transcribe MediaFormat enum
            const ext = s3Key.split('.').pop()?.toLowerCase() || 'm4a';
            const mediaFormat = ext === 'webm' ? 'webm'
                : ext === 'mp3'  ? 'mp3'
                : ext === 'wav'  ? 'wav'
                : ext === 'flac' ? 'flac'
                : 'mp4'; // m4a, mp4 → 'mp4'

            const s3Uri = `s3://${STORAGE_BUCKET}/${s3Key}`;
            await transcribeClient.send(new StartTranscriptionJobCommand({
                TranscriptionJobName: jobName,
                // Use specific language — IdentifyLanguage produces empty transcripts with WebM
                LanguageCode: 'vi-VN',
                MediaFormat: mediaFormat as any,
                Media: { MediaFileUri: s3Uri },
            }));

            const transcript = await waitForTranscription(jobName);

            // Cleanup: xóa Transcribe job và voice file khỏi S3 (ephemeral)
            await Promise.allSettled([
                transcribeClient.send(new DeleteTranscriptionJobCommand({ TranscriptionJobName: jobName })),
                s3Client.send(new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: s3Key })),
            ]);

            debug(`[voiceToFood] jobName=${jobName}, transcriptLength=${transcript?.length || 0}, s3Key=${s3Key}`);

            if (!transcript) {
                return JSON.stringify({ success: false, error: 'Empty transcription' });
            }

            const qwenResult = await callQwen([
                { role: "system", content: VOICE_SYSTEM_PROMPT },
                { role: "user", content: `User said: "${transcript}"\n\nAnalyze and return JSON following the output format.` },
            ]);

            // ==========================================
            // RECALCULATE with DB Data (Phase 1)
            // ==========================================
            try {
                const aiResponse = JSON.parse(qwenResult);
                if (aiResponse.action === 'log' && aiResponse.food_data) {
                    const foodData = aiResponse.food_data;
                    const ingredients = foodData.ingredients || [];
                    const tableName = await discoverTableName();
                    
                    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
                    const processedIngredients = [];

                    for (const ing of ingredients) {
                        const searchName = ing.name_vi || ing.name_en || ing.name;
                        const dbMatch = await findFoodInDB(searchName, tableName);
                        if (dbMatch) {
                            const nutrition = calculateNutrition(dbMatch, ing.weight_g || 100);
                            processedIngredients.push({
                                ...ing,
                                food_id: dbMatch.food_id,
                                name_vi_db: dbMatch.name_vi,
                                name_en_db: dbMatch.name_en,
                                matched: true,
                                source: 'database',
                                ...nutrition
                            });
                            totalCalories += (nutrition.calories || 0);
                            totalProtein += (nutrition.protein_g || 0);
                            totalCarbs += (nutrition.carbs_g || 0);
                            totalFat += (nutrition.fat_g || 0);
                        } else {
                            processedIngredients.push({
                                ...ing,
                                matched: false,
                                source: 'ai_estimated'
                            });
                            // Keep AI estimated values
                            totalCalories += (ing.calories || 0);
                            totalProtein += (ing.protein_g || 0);
                            totalCarbs += (ing.carbs_g || 0);
                            totalFat += (ing.fat_g || 0);
                        }
                    }

                    // Only overwrite macros if recalculated total is meaningful (>0),
                    // otherwise keep Qwen's original food_data.macros estimates
                    const hasRecalculatedData = totalCalories > 0 || totalProtein > 0 || totalCarbs > 0 || totalFat > 0;
                    if (hasRecalculatedData) {
                        aiResponse.food_data.macros = {
                            ...aiResponse.food_data.macros,
                            calories: Math.round(totalCalories * 10) / 10,
                            protein_g: Math.round(totalProtein * 10) / 10,
                            carbs_g: Math.round(totalCarbs * 10) / 10,
                            fat_g: Math.round(totalFat * 10) / 10
                        };
                    }
                    aiResponse.food_data.ingredients = processedIngredients;
                    aiResponse.db_verified = processedIngredients.some(i => i.matched);
                    
                    return JSON.stringify({ 
                        success: true, 
                        transcript, 
                        text: JSON.stringify(aiResponse) 
                    });
                }
            } catch (calcError) {
                console.error('Recalculation error:', calcError);
            }

            return JSON.stringify({ success: true, transcript, text: qwenResult });
        }

        // ── Helper functions for DB Lookup ──
        async function discoverTableName(): Promise<string> {
            const result = await dbClient.send(new ListTablesCommand({}));
            return result.TableNames?.find((name: string) => name.startsWith('Food-')) || "";
        }

        function normalize(text: string): string {
            if (!text) return "";
            return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        }

        async function findFoodInDB(query: string, tableName: string): Promise<any | null> {
            if (!tableName || !query) return null;
            const q = query.toLowerCase().trim();

            // 1. Exact match (name_vi or name_en) - GSI
            const qVi = await docClient.send(new QueryCommand({
                TableName: tableName, IndexName: 'name_vi',
                KeyConditionExpression: 'name_vi = :name',
                ExpressionAttributeValues: { ':name': query }
            }));
            if (qVi.Items?.length) return qVi.Items[0];

            const qEn = await docClient.send(new QueryCommand({
                TableName: tableName, IndexName: 'name_en',
                KeyConditionExpression: 'name_en = :name',
                ExpressionAttributeValues: { ':name': query }
            }));
            if (qEn.Items?.length) return qEn.Items[0];

            // 2. Partial match (contains) - Broad search
            const scanAny = await docClient.send(new ScanCommand({
                TableName: tableName,
                FilterExpression: 'contains(name_vi, :q) OR contains(name_en, :q) OR contains(aliases_vi, :q) OR contains(aliases_en, :q)',
                ExpressionAttributeValues: { ':q': query }
            }));
            if (scanAny.Items?.length) {
                // Return shortest name match first (most likely to be the core item)
                return scanAny.Items.sort((a, b) => a.name_vi.length - b.name_vi.length)[0];
            }

            return null;
        }

        function calculateNutrition(dbFood: any, weightG: number) {
            const m = dbFood.macros || {};
            const r = weightG / 100;
            return {
                calories: Math.round((m.calories || 0) * r * 10) / 10,
                protein_g: Math.round((m.protein_g || 0) * r * 10) / 10,
                carbs_g: Math.round((m.carbs_g || 0) * r * 10) / 10,
                fat_g: Math.round((m.fat_g || 0) * r * 10) / 10
            };
        }


        // ── Ollie Coach Tip (quick nudge) ──
        if (action === 'ollieCoachTip') {
            const { promptTemplate, context } = data;
            const text = await callQwen([
                { role: "system", content: OLLIE_COACH_SYSTEM_PROMPT },
                { role: "user", content: promptTemplate || context },
            ]);
            return JSON.stringify({ success: true, text });
        }

        // ── Recipe Generator ──
        if (action === 'generateRecipe') {
            const { inventoryText, expiringText, nutritionGoal, servings } = data;
            const text = await callQwen([
                { role: "system", content: RECIPE_SYSTEM_PROMPT },
                { role: "user", content: `User's fridge inventory:\n${inventoryText}\n\nExpiring soon (MUST USE):\n${expiringText}\n\nNutrition goal: ${nutritionGoal}\nNumber of servings: ${servings}\n\nSuggest 1-3 recipes. Return JSON only.` },
            ]);
            return JSON.stringify({ success: true, text });
        }

        // ── Macro Calculator ──
        if (action === 'calculateMacros') {
            const { userProfileJson } = data;
            const text = await callQwen([
                { role: "system", content: MACRO_CALCULATOR_SYSTEM_PROMPT },
                { role: "user", content: `Calculate daily nutritional targets for the following user profile:\n\n${JSON.stringify(userProfileJson, null, 2)}\n\nReturn ONLY the JSON object.` },
            ]);
            return JSON.stringify({ success: true, text });
        }

// ── Weekly Insight ──
        if (action === 'weeklyInsight') {
            const { userProfileJson, weeklySummaryJson, notablePatterns } = data;
            const text = await callQwen([
                { role: "system", content: WEEKLY_INSIGHT_SYSTEM_PROMPT },
                { role: "user", content: `Analyze this user's weekly data and generate the Weekly Insight:\n\nUser Profile:\n${JSON.stringify(userProfileJson, null, 2)}\n\nWeekly Summary:\n${JSON.stringify(weeklySummaryJson, null, 2)}\n\nNotable Patterns:\n${notablePatterns}\n\nReturn ONLY the JSON object.` },
            ]);
            return JSON.stringify({ success: true, text });
        }

        return JSON.stringify({ success: false, error: `Unknown action: ${action}` });

    } catch (error: any) {
        debug('Bedrock Lambda Error:', error.message);
        return JSON.stringify({ success: false, error: error.message });
    }
};
```

---

[Quay lại danh sách các hàm](../)


## Function scan-image


Hàm này đóng vai trò trung gian (Proxy) để gửi các yêu cầu phân tích hình ảnh từ AppSync tới cụm **ECS Fargate** thông qua Application Load Balancer.

### 1. Cấu hình Tài nguyên (`resource.ts`)

```typescript
import { defineFunction } from '@aws-amplify/backend';

export const scanImage = defineFunction({
  name: 'scan-image',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 1024,
  timeoutSeconds: 300,
});
```

### 2. Mã nguồn xử lý (`handler.ts`)

```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { createHmac } from "crypto";

const REGION = "ap-southeast-2";
const s3Client = new S3Client({ region: REGION });
const secretsClient = new SecretsManagerClient({ region: REGION });

const STORAGE_BUCKET = process.env.STORAGE_BUCKET_NAME || "";
const ECS_BASE_URL = process.env.ECS_BASE_URL || "";
const IS_DEBUG = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

const debug = (message: string, data?: any) => {
  if (IS_DEBUG) {
    console.log(`[scan-image] ${message}`, data || "");
  }
};

// Cache secrets across warm Lambda invocations
let cachedSecrets: { apiKey: string; internalToken: string } | null = null;

async function getSecrets(): Promise<{ apiKey: string; internalToken: string }> {
  if (cachedSecrets) return cachedSecrets;

  const resp = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: "nutritrack/prod/api-keys" })
  );
  const secret = JSON.parse(resp.SecretString || "{}");
  cachedSecrets = {
    apiKey: secret.NUTRITRACK_API_KEY || "",
    internalToken: secret.NUTRITRACK_INTERNAL_TOKEN || "",
  };
  return cachedSecrets;
}

// Generate HS256 JWT using Node.js built-in crypto (no external JWT library needed)
function generateJWT(secret: string): string {
  const b64url = (buf: Buffer) =>
    buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  const header = b64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(
    Buffer.from(JSON.stringify({ service: "backend", iat: now, exp: now + 300 }))
  );
  const data = `${header}.${payload}`;
  const sig = b64url(createHmac("sha256", secret).update(data).digest());
  return `${data}.${sig}`;
}

const ACTION_TO_ENDPOINT: Record<string, string> = {
  analyzeFoodImage: "/analyze-food?method=tools",
  analyzeFoodLabel: "/analyze-label",
  scanBarcode: "/scan-barcode",
};

// Poll /jobs/{jobId} until completed or failed
async function pollJob(
  jobId: string,
  authHeader: string,
  internalToken: string,
  signal: AbortSignal,
  stickyCookie?: string,
  pollIntervalMs = 3000,
  maxWaitMs = 270_000
): Promise<any> {
  const pollUrl = `${ECS_BASE_URL}/jobs/${jobId}`;
  const start = Date.now();

  while (true) {
    if (Date.now() - start > maxWaitMs) {
      throw new Error("Job polling timeout — analysis took too long");
    }

    // Wait before polling
    await new Promise<void>((resolve) => {
      const t = setTimeout(resolve, pollIntervalMs);
      signal.addEventListener("abort", () => { clearTimeout(t); resolve(); }, { once: true });
    });

    if (signal.aborted) throw new Error("AbortError");

    const pollHeaders: Record<string, string> = {
      Authorization: authHeader,
      "X-Nutri-Internal-Token": internalToken,
    };
    if (stickyCookie) pollHeaders["Cookie"] = stickyCookie;

    const resp = await fetch(pollUrl, {
      headers: pollHeaders,
      signal,
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`Job poll failed (${resp.status}): ${body}`);
    }

    const job = await resp.json();
    debug("Poll result", { status: job.status });

    if (job.status === "completed") {
      return job.result;
    }

    if (job.status === "failed") {
      throw new Error(job.error || "ECS job failed");
    }
    // status === "processing" → keep polling
  }
}

interface GENFOODMacros {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  saturated_fat_g: number;
  polyunsaturated_fat_g: number;
  monounsaturated_fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  cholesterol_mg: number;
  potassium_mg: number;
}

interface GENFOODMicronutrients {
  calcium_mg: number;
  iron_mg: number;
  vitamin_a_ug: number;
  vitamin_c_mg: number;
}

interface GENFOODServing {
  default_g: number;
  unit: string;
  portions?: Record<string, number>;
}

interface GENFOODIngredient {
  name_vi: string;
  name_en: string;
  weight_g: number;
}

interface GENFOOD {
  food_id: string;
  name_vi: string;
  name_en: string;
  macros: GENFOODMacros;
  micronutrients: GENFOODMicronutrients;
  serving: GENFOODServing;
  ingredients: GENFOODIngredient[];
  verified: boolean;
  source: string;
}

const EMPTY_MACROS = {
  saturated_fat_g: 0, polyunsaturated_fat_g: 0, monounsaturated_fat_g: 0,
  fiber_g: 0, sugar_g: 0, sodium_mg: 0, cholesterol_mg: 0, potassium_mg: 0,
};
const EMPTY_MICRONUTRIENTS = { calcium_mg: 0, iron_mg: 0, vitamin_a_ug: 0, vitamin_c_mg: 0 };

// Food photo: job.result.data.dishes[0]
function normalizeFoodToGENFOOD(ecsResult: any): GENFOOD {
  const dish = ecsResult?.data?.dishes?.[0];
  if (!dish) throw new Error("No food detected in image");

  const n = dish.nutritions || {};
  return {
    food_id: "custom_gen_temp",
    name_vi: dish.vi_name || dish.name || "Unknown Food",
    name_en: dish.name || "Unknown Food",
    macros: {
      calories: Number(n.calories) || 0,
      protein_g: Number(n.protein) || 0,
      carbs_g: Number(n.carbs) || 0,
      fat_g: Number(n.fat) || 0,
      ...EMPTY_MACROS,
    },
    micronutrients: EMPTY_MICRONUTRIENTS,
    serving: {
      default_g: Number(dish.weight || dish.serving_value) || 0,
      unit: dish.serving_unit || "serving",
      portions: { small: 0.7, medium: 1.0, large: 1.3 },
    },
    ingredients: (dish.ingredients || []).map((ing: any) => ({
      name_vi: ing.name || "Ingredient",
      name_en: ing.name || "Ingredient",
      weight_g: Number(ing.weight) || 0,
    })),
    verified: false,
    source: "ECS Scan",
  };
}

// Nutrition label: job.result.data.labels[0]
// label.nutrition = [{ nutrient: "Chất đạm", value: 6.9, unit: "g" }, ...]
function normalizeLabelToGENFOOD(ecsResult: any): GENFOOD {
  const label = ecsResult?.data?.labels?.[0];
  if (!label) throw new Error("No nutrition label detected in image");

  const nutrition: { nutrient: string; value: number }[] = label.nutrition || [];
  const findNutrient = (...keywords: string[]) => {
    const item = nutrition.find((it) =>
      keywords.some((k) => it.nutrient.toLowerCase().includes(k))
    );
    return Number(item?.value) || 0;
  };

  return {
    food_id: "custom_label_temp",
    name_vi: label.name || "Sản phẩm",
    name_en: label.name || "Product",
    macros: {
      calories: findNutrient("năng lượng", "energy", "calori", "kcal"),
      protein_g: findNutrient("đạm", "protein"),
      carbs_g: findNutrient("carbohydrate", "glucid", "tinh bột", "đường bột"),
      fat_g: findNutrient("béo", "fat", "lipid"),
      ...EMPTY_MACROS,
    },
    micronutrients: EMPTY_MICRONUTRIENTS,
    serving: {
      default_g: Number(label.serving_value) || 0,
      unit: label.serving_unit || "g",
      portions: { small: 0.7, medium: 1.0, large: 1.3 },
    },
    ingredients: (label.ingredients || []).map((name: string) => ({
      name_vi: name,
      name_en: name,
      weight_g: 0,
    })),
    verified: false,
    source: "ECS Label Scan",
  };
}

// Barcode: job.result.data = { found: bool, food: { product_name, nutritions: { calories, protein, fat, carbs } } }
function normalizeBarcodeToGENFOOD(ecsResult: any): GENFOOD {
  const data = ecsResult?.data;
  if (!data?.found) throw new Error("Barcode not found or product not in database");

  const food = data.food;
  if (!food) throw new Error("No product data for barcode");

  const n = food.nutritions || {};
  return {
    food_id: `barcode_${food.barcode || "unknown"}`,
    name_vi: food.product_name || food.name || "Sản phẩm",
    name_en: food.product_name || food.name || "Product",
    macros: {
      calories: Number(n.calories) || 0,
      protein_g: Number(n.protein) || 0,
      carbs_g: Number(n.carbs) || 0,
      fat_g: Number(n.fat) || 0,
      fiber_g: Number(n.fiber) || 0,
      sugar_g: Number(n.sugar) || 0,
      sodium_mg: Number(n.sodium) ? Number(n.sodium) * 1000 : 0,
      saturated_fat_g: 0, polyunsaturated_fat_g: 0, monounsaturated_fat_g: 0,
      cholesterol_mg: 0, potassium_mg: 0,
    },
    micronutrients: EMPTY_MICRONUTRIENTS,
    serving: {
      default_g: 100,
      unit: "g",
      portions: { small: 0.7, medium: 1.0, large: 1.3 },
    },
    ingredients: [],
    verified: true,
    source: `Barcode (${data.source || "database"})`,
  };
}

function normalizeEcsResult(action: string, ecsResult: any): GENFOOD {
  switch (action) {
    case "analyzeFoodLabel": return normalizeLabelToGENFOOD(ecsResult);
    case "scanBarcode":      return normalizeBarcodeToGENFOOD(ecsResult);
    default:                 return normalizeFoodToGENFOOD(ecsResult);
  }
}

export const handler = async (event: any) => {
  try {
    const { action, payload } = event.arguments;

    debug("Handler invoked", { action, hasPayload: !!payload });

    // Validate action
    if (!ACTION_TO_ENDPOINT[action]) {
      return JSON.stringify({
        success: false,
        error: `Unknown action: ${action}`,
      });
    }

    // Parse payload
    let s3Key: string;
    try {
      const parsed = JSON.parse(payload || "{}");
      s3Key = parsed.s3Key;
    } catch (e) {
      return JSON.stringify({
        success: false,
        error: "Invalid payload JSON",
      });
    }

    // Validate s3Key
    if (!s3Key || typeof s3Key !== "string") {
      return JSON.stringify({
        success: false,
        error: "Missing or invalid s3Key in payload",
      });
    }

    if (s3Key.includes("..")) {
      return JSON.stringify({
        success: false,
        error: "Invalid s3Key: path traversal not allowed",
      });
    }

    debug("Downloading image from S3", { s3Key });

    // Download image from S3
    const s3Response = await s3Client.send(
      new GetObjectCommand({
        Bucket: STORAGE_BUCKET,
        Key: s3Key,
      })
    );

    // Stream body to buffer
    const chunks: Uint8Array[] = [];
    const stream = s3Response.Body;
    if (!stream) {
      throw new Error("Failed to read S3 object");
    }

    for await (const chunk of stream as any) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }

    const imageBuffer = Buffer.concat(chunks);
    const contentType = s3Response.ContentType || "image/jpeg";

    debug("Image downloaded", { size: imageBuffer.length, contentType });

    // Get API key + generate JWT for ECS auth
    const secrets = await getSecrets();
    if (!secrets.apiKey) {
      return JSON.stringify({
        success: false,
        error: "ECS API key not configured",
      });
    }
    const token = generateJWT(secrets.apiKey);
    const authHeader = `Bearer ${token}`;
    const internalToken = secrets.internalToken;

    // Build FormData with Blob
    const blob = new Blob([imageBuffer], { type: contentType });
    const form = new FormData();
    form.append("file", blob, "upload.jpg");

    // Call ECS — POST to get job_id (async response, HTTP 202)
    const endpoint = ACTION_TO_ENDPOINT[action];
    const ecsUrl = `${ECS_BASE_URL}${endpoint}`;

    debug("Calling ECS", { ecsUrl });

    const controller = new AbortController();
    // 290s total: ~3s init + up to 270s polling + buffer
    const timeout = setTimeout(() => controller.abort(), 290_000);

    let jobId: string;
    let stickyCookie: string | undefined;
    try {
      const initResponse = await fetch(ecsUrl, {
        method: "POST",
        body: form,
        headers: { Authorization: authHeader, "X-Nutri-Internal-Token": internalToken },
        signal: controller.signal,
      });

      if (!initResponse.ok) {
        const errorBody = await initResponse.text();
        let errorDetail = "Analysis failed";
        try {
          const errorJson = JSON.parse(errorBody);
          errorDetail = errorJson.detail || errorDetail;
        } catch {
          // Ignore parse errors
        }
        return JSON.stringify({
          success: false,
          error: `ECS error: ${errorDetail}`,
        });
      }

      const initBody = await initResponse.json();
      jobId = initBody.job_id;

      if (!jobId) {
        return JSON.stringify({
          success: false,
          error: "ECS did not return a job_id",
        });
      }

      // Read ALB sticky cookie to ensure polls go to same ECS task
      const setCookie = initResponse.headers.get("set-cookie");
      stickyCookie = setCookie ? setCookie.split(";")[0] : undefined;

      debug("Job accepted", { jobId, status: initBody.status });
    } finally {
      // Don't clear timeout yet — still need it for polling
    }

    // Poll for result
    let ecsResult: any;
    try {
      ecsResult = await pollJob(jobId, authHeader, internalToken, controller.signal, stickyCookie);
    } finally {
      clearTimeout(timeout);
    }

    debug("Job completed", { jobId });

    // Normalize response based on action type
    const genfood = normalizeEcsResult(action, ecsResult);

    return JSON.stringify({
      success: true,
      text: JSON.stringify(genfood),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[scan-image] Error:", errorMessage, error);

    if (errorMessage.includes("NoSuchKey")) {
      return JSON.stringify({
        success: false,
        error: "Image not found in S3",
      });
    }

    if (
      errorMessage.includes("AbortError") ||
      errorMessage.includes("timeout")
    ) {
      return JSON.stringify({
        success: false,
        error: "Image processing service unavailable (timeout)",
      });
    }

    if (errorMessage.includes("ECONNREFUSED")) {
      return JSON.stringify({
        success: false,
        error: "Image processing service unavailable (connection refused)",
      });
    }

    return JSON.stringify({
      success: false,
      error: errorMessage,
    });
  }
};

```

---

[Quay lại danh sách các hàm](../)


## Function process-nutrition


Hàm này xử lý việc tính toán các chỉ số dinh dưỡng (Macros) và lưu trữ chúng trực tiếp vào bảng **DynamoDB**.

### 1. Cài đặt thư viện (npm install)

Cài đặt SDK để tương tác với cơ sở dữ liệu:

```bash
cd amplify/process-nutrition
npm install
```

### 2. Cấu hình Tài nguyên (`resource.ts`)

```typescript
import { defineFunction } from '@aws-amplify/backend';

export const processNutrition = defineFunction({
  name: 'process-nutrition',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 512,
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
```

### 2. Mã nguồn xử lý (`handler.ts`)

```typescript
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
// @ts-ignore
import type { Schema } from '../data/resource';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';
const IS_DEBUG = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const debug = (message: string, data?: any) => {
  if (IS_DEBUG) console.log(`[process-nutrition] ${message}`, data || "");
};

let cachedTableName: string | null = null;

async function discoverTableName(): Promise<string> {
  if (cachedTableName) return cachedTableName;
  if (process.env.FOOD_TABLE_NAME) {
    cachedTableName = process.env.FOOD_TABLE_NAME;
    return cachedTableName;
  }
  const result = await client.send(new ListTablesCommand({}));
  const foodTable = result.TableNames?.find((name: string) => name.startsWith('Food-'));
  if (!foodTable) throw new Error('Food table not found');
  cachedTableName = foodTable;
  return cachedTableName;
}

/**
 * Chuẩn hóa chuỗi: xóa dấu, viết thường, trim
 */
function normalize(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Tìm kiếm món ăn trong DB sử dụng Query (GSI) và Scan (Aliases)
 */
async function findFoodInDB(query: string, tableName: string): Promise<any | null> {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  debug(`Searching for: "${q}"`);

  // 1. Exact match (name_vi or name_en) - GSI
  const queryVi = await docClient.send(new QueryCommand({
    TableName: tableName,
    IndexName: 'name_vi',
    KeyConditionExpression: 'name_vi = :name',
    ExpressionAttributeValues: { ':name': query }
  }));
  if (queryVi.Items?.length) return queryVi.Items[0];

  const queryEn = await docClient.send(new QueryCommand({
    TableName: tableName,
    IndexName: 'name_en',
    KeyConditionExpression: 'name_en = :name',
    ExpressionAttributeValues: { ':name': query }
  }));
  if (queryEn.Items?.length) return queryEn.Items[0];

  // 2. Partial match (contains) - Broad search
  const scanAny = await docClient.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: 'contains(name_vi, :q) OR contains(name_en, :q) OR contains(aliases_vi, :q) OR contains(aliases_en, :q)',
    ExpressionAttributeValues: { ':q': query }
  }));

  if (scanAny.Items?.length) {
    // Return shortest name match first (most likely to be the core item)
    return scanAny.Items.sort((a, b) => a.name_vi.length - b.name_vi.length)[0];
  }

  return null;
}

function calculateNutrition(dbFood: any, estimatedG: number) {
  const macros = dbFood.macros || {};
  const ratio = estimatedG / 100;
  return {
    calories: Math.round((macros.calories || 0) * ratio * 10) / 10,
    protein_g: Math.round((macros.protein_g || 0) * ratio * 10) / 10,
    carbs_g: Math.round((macros.carbs_g || 0) * ratio * 10) / 10,
    fat_g: Math.round((macros.fat_g || 0) * ratio * 10) / 10,
  };
}

// @ts-ignore
export const handler: Schema['processNutrition']['functionHandler'] = async (event: any) => {
  const { payload } = event.arguments;
  const tableName = await discoverTableName();

  try {
    const data = JSON.parse(payload);
    
    // CASE 1: Tìm kiếm trực tiếp (AppSync search)
    if (data.action === 'directSearch') {
      const match = await findFoodInDB(data.query, tableName);
      if (match) {
        const serving = match.serving || {};
        const defaultG = serving.default_g || 100;
        return JSON.stringify({
          success: true,
          source: 'database',
          food: {
            ...match,
            calculated_nutrition: match.macros 
          }
        });
      }
      return JSON.stringify({ success: false, error: 'Not found in DB' });
    }

    // CASE 2: Xử lý dữ liệu từ AI (Voice/Image) - Recalculate
    const aiItems = data.items || [data];
    const processedItems = [];

    for (const aiItem of aiItems) {
      const ingredients = aiItem.ingredients || [];
      const processedIngredients = [];
      let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

      for (const ing of ingredients) {
        const dbMatch = await findFoodInDB(ing.name || ing.name_vi, tableName);
        if (dbMatch) {
          const nutrition = calculateNutrition(dbMatch, ing.weight_g || ing.estimated_g || 100);
          processedIngredients.push({
            ...ing,
            food_id: dbMatch.food_id,
            name_vi_db: dbMatch.name_vi,
            matched: true,
            source: 'database',
            ...nutrition
          });
          totalCalories += nutrition.calories;
          totalProtein += nutrition.protein_g;
          totalCarbs += nutrition.carbs_g;
          totalFat += nutrition.fat_g;
        } else {
          processedIngredients.push({
            ...ing,
            matched: false,
            source: 'ai_estimated'
          });
          totalCalories += (ing.calories || 0);
          totalProtein += (ing.protein_g || 0);
          totalCarbs += (ing.carbs_g || 0);
          totalFat += (ing.fat_g || 0);
        }
      }

      processedItems.push({
        ...aiItem,
        total_calories: Math.round(totalCalories * 10) / 10,
        total_protein_g: Math.round(totalProtein * 10) / 10,
        total_carbs_g: Math.round(totalCarbs * 10) / 10,
        total_fat_g: Math.round(totalFat * 10) / 10,
        ingredients: processedIngredients,
        db_verified: processedIngredients.some(i => i.matched)
      });
    }

    return JSON.stringify({ success: true, items: processedItems });

  } catch (error) {
    debug('Error:', error);
    return JSON.stringify({ success: false, error: String(error) });
  }
};
```

---

[Quay lại danh sách các hàm](../)


## Function friend-request


Hàm này quản lý các logic phức tạp liên quan đến hệ thống bạn bè, bao gồm gửi yêu cầu, chấp nhận và quản lý liên kết giữa người dùng.

### 1. Cài đặt thư viện (npm install)

```bash
cd amplify/friend-request
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 2. Cấu hình Tài nguyên (`resource.ts`)

```typescript
import { defineFunction } from '@aws-amplify/backend';

export const friendRequest = defineFunction({
  name: 'friend-request',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 256,
  timeoutSeconds: 15,
  resourceGroupName: 'data',
});
```

### 3. Mã nguồn xử lý (`handler.ts`)

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';
const IS_DEBUG = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Simple debug logger - respects DEBUG env var
const debug = (message: string, data?: any) => {
  if (IS_DEBUG) {
    console.log(`[friend-request] ${message}`, data || "");
  }
};

// Table names injected by CDK at deploy time — correct for each environment (sandbox + branch deploy)
const USER_TABLE = process.env.USER_TABLE_NAME;
const FRIENDSHIP_TABLE = process.env.FRIENDSHIP_TABLE_NAME;

function getTableNames(): { userTable: string; friendshipTable: string } {
  if (!USER_TABLE) throw new Error('USER_TABLE_NAME env var not set');
  if (!FRIENDSHIP_TABLE) throw new Error('FRIENDSHIP_TABLE_NAME env var not set');
  return { userTable: USER_TABLE, friendshipTable: FRIENDSHIP_TABLE };
}

// ─── Actions ───

type FriendAction = 'sendRequest' | 'acceptRequest' | 'declineRequest' | 'removeFriend' | 'blockFriend';

interface HandlerEvent {
  arguments: {
    action: FriendAction;
    payload: string;
  };
  identity?: {
    sub?: string;
    username?: string;
    claims?: { sub?: string; 'cognito:username'?: string };
  };
}

interface CallerIdentity {
  sub: string;
  owner: string; // Amplify owner format: "sub::cognitoUsername"
}

function getCallerIdentity(event: HandlerEvent): CallerIdentity {
  const sub = event.identity?.sub || event.identity?.claims?.sub;
  if (!sub) throw new Error('Unauthorized: no user identity');
  const username = event.identity?.username
    || event.identity?.claims?.['cognito:username']
    || sub;
  return { sub, owner: `${sub}::${username}` };
}

export const handler = async (event: HandlerEvent): Promise<string> => {
  const { action, payload } = event.arguments;
  const caller = getCallerIdentity(event);
  const params = JSON.parse(payload || '{}');

  try {
    switch (action) {
      case 'sendRequest':
        return JSON.stringify(await sendRequest(caller, params.friend_code));
      case 'acceptRequest':
        return JSON.stringify(await acceptRequest(caller, params.friendship_id));
      case 'declineRequest':
        return JSON.stringify(await declineRequest(caller, params.friendship_id));
      case 'removeFriend':
        return JSON.stringify(await removeFriend(caller, params.friendship_id));
      case 'blockFriend':
        return JSON.stringify(await blockFriend(caller, params.friendship_id));
      default:
        return JSON.stringify({ success: false, error: `Unknown action: ${action}` });
    }
  } catch (error: any) {
    debug(`${action} error`, error.message || String(error));
    return JSON.stringify({ success: false, error: error.message || 'Internal error' });
  }
};

// ─── sendRequest ───
// Caller enters a friend_code → lookup user → create 2 Friendship records

async function sendRequest(caller: CallerIdentity, friendCode: string) {
  if (!friendCode) throw new Error('friend_code is required');

  const { userTable, friendshipTable } = getTableNames();

  // 1. Lookup friend by friend_code
  const friendUser = await findUserByFriendCode(userTable, friendCode);

  if (!friendUser) throw new Error('Không tìm thấy người dùng với mã này');
  if (friendUser.user_id === caller.sub) throw new Error('Không thể kết bạn với chính mình');

  // 2. Get caller's profile for display name
  const callerUser = await getUserById(userTable, caller.sub);
  if (!callerUser) throw new Error('Caller profile not found');

  // 3. Check for existing friendship (no duplicates)
  const existing = await findExistingFriendship(friendshipTable, caller.owner, friendUser.user_id);
  if (existing) {
    if (existing.status === 'accepted') throw new Error('Đã là bạn bè rồi');
    if (existing.status === 'pending') throw new Error('Đã gửi lời mời rồi');
    if (existing.status === 'blocked') throw new Error('Không thể gửi lời mời');
  }

  // 4. Check pending limit (max 20)
  const pendingCount = await countPendingRequests(friendshipTable, caller.owner);
  if (pendingCount >= 20) throw new Error('Đã đạt giới hạn 20 lời mời đang chờ');

  // 5. Get friend's Amplify owner identity from their user record
  // Amplify sets owner as "sub::cognitoUsername" — read it directly from DB
  const friendOwner = friendUser.owner;
  if (!friendOwner) throw new Error('Friend user record missing owner field');

  // 6. Create 2 Friendship records atomically
  const now = new Date().toISOString();
  const sentId = randomUUID();
  const receivedId = randomUUID();

  await docClient.send(new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: friendshipTable,
          Item: {
            id: sentId,
            owner: caller.owner,
            friend_id: friendUser.user_id,
            friend_code: friendCode,
            friend_name: friendUser.display_name || friendUser.email || 'User',
            friend_avatar: friendUser.avatar_url || null,
            status: 'pending',
            direction: 'sent',
            linked_id: receivedId,
            createdAt: now,
            updatedAt: now,
          },
        },
      },
      {
        Put: {
          TableName: friendshipTable,
          Item: {
            id: receivedId,
            owner: friendOwner,
            friend_id: caller.sub,
            friend_code: callerUser.friend_code || '',
            friend_name: callerUser.display_name || callerUser.email || 'User',
            friend_avatar: callerUser.avatar_url || null,
            status: 'pending',
            direction: 'received',
            linked_id: sentId,
            createdAt: now,
            updatedAt: now,
          },
        },
      },
    ],
  }));

  return {
    success: true,
    friend_name: friendUser.display_name || friendUser.email,
    friendship_id: sentId,
  };
}

// ─── acceptRequest ───
// Caller accepts a received request → update both records to accepted

async function acceptRequest(caller: CallerIdentity, friendshipId: string) {
  if (!friendshipId) throw new Error('friendship_id is required');

  const { friendshipTable } = getTableNames();

  // 1. Get the received record
  const receivedRecord = await getFriendshipById(friendshipTable, friendshipId);
  if (!receivedRecord) throw new Error('Friendship record not found');

  // Verify the caller owns this record (compare sub part of owner)
  const ownerSub = receivedRecord.owner?.split('::')[0];
  if (ownerSub !== caller.sub) throw new Error('Unauthorized');
  if (receivedRecord.direction !== 'received') throw new Error('Can only accept received requests');
  if (receivedRecord.status !== 'pending') throw new Error('Request is not pending');

  const linkedId = receivedRecord.linked_id;
  if (!linkedId) throw new Error('Linked friendship record not found');

  // 2. Update both records atomically
  const now = new Date().toISOString();

  await docClient.send(new TransactWriteCommand({
    TransactItems: [
      {
        Update: {
          TableName: friendshipTable,
          Key: { id: friendshipId },
          UpdateExpression: 'SET #s = :status, updatedAt = :now',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: { ':status': 'accepted', ':now': now },
        },
      },
      {
        Update: {
          TableName: friendshipTable,
          Key: { id: linkedId },
          UpdateExpression: 'SET #s = :status, updatedAt = :now',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: { ':status': 'accepted', ':now': now },
        },
      },
    ],
  }));

  return { success: true };
}

// ─── declineRequest ───

async function declineRequest(caller: CallerIdentity, friendshipId: string) {
  if (!friendshipId) throw new Error('friendship_id is required');

  const { friendshipTable } = getTableNames();

  const record = await getFriendshipById(friendshipTable, friendshipId);
  if (!record) throw new Error('Friendship record not found');

  const ownerSub = record.owner?.split('::')[0];
  if (ownerSub !== caller.sub) throw new Error('Unauthorized');

  const linkedId = record.linked_id;

  // Delete both records
  const transactItems: any[] = [
    { Delete: { TableName: friendshipTable, Key: { id: friendshipId } } },
  ];
  if (linkedId) {
    transactItems.push({ Delete: { TableName: friendshipTable, Key: { id: linkedId } } });
  }

  await docClient.send(new TransactWriteCommand({ TransactItems: transactItems }));

  return { success: true };
}

// ─── removeFriend ───

async function removeFriend(caller: CallerIdentity, friendshipId: string) {
  // Same as decline — delete both records
  return declineRequest(caller, friendshipId);
}

// ─── blockFriend ───

async function blockFriend(caller: CallerIdentity, friendshipId: string) {
  if (!friendshipId) throw new Error('friendship_id is required');

  const { friendshipTable } = getTableNames();

  const record = await getFriendshipById(friendshipTable, friendshipId);
  if (!record) throw new Error('Friendship record not found');

  const ownerSub = record.owner?.split('::')[0];
  if (ownerSub !== caller.sub) throw new Error('Unauthorized');

  const linkedId = record.linked_id;
  const now = new Date().toISOString();

  // Update caller's record to blocked, delete the other person's record
  const transactItems: any[] = [
    {
      Update: {
        TableName: friendshipTable,
        Key: { id: friendshipId },
        UpdateExpression: 'SET #s = :status, updatedAt = :now',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: { ':status': 'blocked', ':now': now },
      },
    },
  ];
  if (linkedId) {
    transactItems.push({ Delete: { TableName: friendshipTable, Key: { id: linkedId } } });
  }

  await docClient.send(new TransactWriteCommand({ TransactItems: transactItems }));

  return { success: true };
}

// ─── Helpers ───

async function findUserByFriendCode(tableName: string, friendCode: string) {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: tableName,
      IndexName: 'usersByFriend_code',
      KeyConditionExpression: 'friend_code = :code',
      ExpressionAttributeValues: { ':code': friendCode },
      Limit: 1,
    }));
    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
  } catch {
    return null;
  }
}

async function getUserById(tableName: string, userId: string) {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: tableName,
      Key: { user_id: userId },
    }));
    return result.Item || null;
  } catch {
    return null;
  }
}

async function getFriendshipById(tableName: string, id: string) {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: tableName,
      Key: { id },
    }));
    return result.Item || null;
  } catch {
    return null;
  }
}

async function findExistingFriendship(tableName: string, callerOwner: string, friendSub: string) {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: '#o = :owner AND friend_id = :fid',
      ExpressionAttributeNames: { '#o': 'owner' },
      ExpressionAttributeValues: {
        ':owner': callerOwner,
        ':fid': friendSub,
      },
    }));
    return result.Items?.[0] || null;
  } catch {
    return null;
  }
}

async function countPendingRequests(tableName: string, callerOwner: string) {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: '#o = :owner AND #s = :status AND direction = :dir',
      ExpressionAttributeNames: { '#o': 'owner', '#s': 'status' },
      ExpressionAttributeValues: {
        ':owner': callerOwner,
        ':status': 'pending',
        ':dir': 'sent',
      },
      Select: 'COUNT',
    }));
    return result.Count || 0;
  } catch {
    return 0;
  }
}
```

---

[Quay lại danh sách các hàm](../)


## Function resize-image


Hàm này được kích hoạt tự động mỗi khi có hình ảnh được tải lên S3 để thu nhỏ kích thước (Resize) và tạo hình ảnh thu nhỏ (Thumbnail).

### 1. Cài đặt thư viện (npm install)

Hàm này yêu cầu thư viện xử lý hình ảnh `sharp` và SDK của S3:

```bash
cd amplify/resize-image
npm install sharp @aws-sdk/client-s3
```

### 2. Chuẩn bị Lambda Layer (Sharp)

Vì thư viện `sharp` cần các file thực thi (binaries) tương thích với môi trường Linux của AWS Lambda, chúng ta nên đóng gói nó thành một Layer riêng bằng cách tải file `.zip` lên AWS Console.

![Tạo Lambda Layer](/images/layer.PNG)

Sau khi tạo xong, AWS sẽ trả về một mã **ARN**. Bạn sẽ dùng mã này để điền vào tệp `resource.ts` dưới đây.

### 3. Cấu hình Tài nguyên (`resource.ts`)

```typescript
import { defineFunction } from '@aws-amplify/backend';

export const resizeImage = defineFunction({
  name: 'resize-image',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 512,
  layers: {
    "sharp": `arn:aws:lambda:ap-southeast-2:${process.env.ACCOUNT_ID}:layer:sharp-node-layer:2`,
  },
  resourceGroupName: 'storage',
});
```

### 4. Mã nguồn xử lý (`handler.ts`)

```typescript
import { S3Handler } from 'aws-lambda';
import { S3Client, HeadObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({});

const MAX_DIMENSION = 1280; // px
const JPEG_QUALITY = 85;

export const handler: S3Handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    // Path format: incoming/{entity_id}/{filename}
    const parts = key.split('/');
    if (parts.length < 3 || parts[0] !== 'incoming') {
      console.warn(`Skip — unexpected path format: ${key}`);
      continue;
    }

    // entity_id is everything between 'incoming/' and the filename
    const entityId = parts.slice(1, parts.length - 1).join('/');
    const originalFilename = parts[parts.length - 1];
    const baseName = originalFilename.replace(/\.[^.]+$/, '');
    const destKey = `media/${entityId}/${baseName}.jpg`;

    console.log(`Processing: ${key} → ${destKey}`);

    try {
      // 1. Validate content type
      const head = await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      const contentType = head.ContentType || '';
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(contentType)) {
        console.error(`Unsupported content type: ${contentType} for ${key}`);
        continue;
      }

      // 2. Read original image
      const s3Obj = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const chunks: Uint8Array[] = [];
      for await (const chunk of s3Obj.Body as any) chunks.push(chunk);
      const originalBuffer = Buffer.concat(chunks);

      // 3. Resize — scale down to MAX_DIMENSION on the longest side, keep aspect ratio
      const resizedBuffer = await sharp(originalBuffer)
        .rotate()
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .toBuffer();
        
      const originalKB = Math.round(originalBuffer.byteLength / 1024);
      const resizedKB = Math.round(resizedBuffer.byteLength / 1024);
      console.log(`Resized: ${originalKB}KB → ${resizedKB}KB`);

      // 4. Save compressed version to media/ (for food-detail display)
      await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: destKey,
        Body: resizedBuffer,
        ContentType: 'image/jpeg',
      }));

      // NOTE: Do NOT delete from incoming/ — aiEngine reads from that path and
      // food-detail also uses the incoming/ key for its presigned URL.
      // The S3 lifecycle rule (expirationInDays: 1 on incoming/) handles cleanup.

      console.log(`Done: compressed image saved to ${destKey}`);
    } catch (err) {
      console.error(`Error processing ${key}:`, err);
    }
  }
};
```

---

[Quay lại danh sách các hàm](../)


## Tầng Container (ECS Fargate)


Tầng ECS Fargate chạy một FastAPI service được container hóa song song với backend Amplify serverless. Nó xử lý các tác vụ không phù hợp với Lambda như: xử lý dữ liệu kéo dài, suy luận AI tùy chỉnh, hoặc các tiến trình cần duy trì kết nối liên tục.

## Kiến trúc Hệ thống

![Kiến trúc NutriTrack API VPC](images/only-nutritrack-api-vpc.drawio.svg)

Các ECS task chạy trong **Private Subnet** để đảm bảo an ninh; **Application Load Balancer (ALB)** nằm trong **Public Subnet** để tiếp nhận yêu cầu từ internet. Task truy cập vào các dịch vụ AWS khác thông qua **NAT Instance** (giúp tiết kiệm 70% chi phí so với NAT Gateway) hoặc **S3 Gateway Endpoint** (miễn phí).

## Ước tính Chi phí

| Thành phần | Chi phí ước tính/tháng |
| :--- | :--- |
| 2× NAT Instance `t4g.nano` | ≈$9 |
| 2× Fargate Task (0.5 vCPU / 1 GB) | ≈$17 |
| Application Load Balancer (ALB) | ≈$16 |
| CloudWatch Logs (5 GB) | ≈$2 |
| **Tổng cộng** | **≈$44** |

> [!TIP]
> Sử dụng NAT Instance thay vì NAT Gateway có thể tiết kiệm cho bạn khoảng $32 mỗi tháng, một con số đáng kể cho các dự án khởi nghiệp hoặc thử nghiệm.

## Các bước triển khai:

1. [5.5.1 Hạ tầng Mạng (VPC & Network)](5.5.1-VPC-Network/)
2. [5.5.2 Hạ tầng hỗ trợ (S3, Secrets, IAM)](5.5.2-Infrastructure/)
3. [5.5.3 Tối ưu hóa NAT (NAT Instance)](5.5.3-NAT-Instance/)
4. [5.5.4 Triển khai Fargate & ALB](5.5.4-Fargate-ALB/)

---

[Tiếp tục đến 6.0 Kết luận & Tiếp theo](../6-Conclusion/)


## Hạ tầng Mạng (VPC & Network)


Hướng dẫn này giúp bạn thiết lập nền tảng mạng AWS cho NutriTrack API: VPC riêng, 4 subnets trên 2 AZ, Internet Gateway, Route Tables, 3 Security Groups, và S3 Gateway VPC Endpoint.

> **Region:** `ap-southeast-2` (Sydney) | **Thời gian ước tính:** 45–60 phút

## Tại sao chọn kiến trúc này?

| Quyết định | Lý do |
| :--- | :--- |
| **ECS Private Subnet** | Container không có IP public → tăng tính bảo mật, tránh tấn công trực tiếp. |
| **ALB Internet-facing** | Điểm duy nhất nhận yêu cầu từ internet, che giấu IP của các container. |
| **NAT Instance** | Tiết kiệm **~70%** chi phí so với NAT Gateway (~$10/tháng so với $34/tháng). |
| **S3 Gateway VPCE** | Truy cập S3 **miễn phí**, không đi qua internet và không tốn băng thông NAT. |
| **High Availability (HA)** | Triển khai trên 2 Availability Zone (AZ) để đảm bảo hệ thống luôn hoạt động. |

---

## 1. Tạo VPC

**VPC (Virtual Private Cloud)** là mạng riêng ảo của bạn trên AWS. Mọi tài nguyên như ECS, ALB, NAT Instance đều sẽ nằm trong VPC này.

### 1.1 Khởi tạo VPC
1. Đăng nhập AWS Console, chọn Region **`ap-southeast-2`**.
2. Tìm kiếm dịch vụ **VPC**.
3. Chọn **Your VPCs** và nhấn **Create VPC**.
4. Cấu hình:
   - **Resources to create**: `VPC only`
   - **Name tag**: `nutritrack-api-vpc`
   - **IPv4 CIDR**: `10.0.0.0/16`
5. Nhấn **Create VPC**.

### 1.2 Bật DNS cho VPC
1. Chọn VPC vừa tạo → **Actions** → **Edit VPC settings**.
2. Bật cả 2 checkbox:
   - ✅ `Enable DNS resolution`
   - ✅ `Enable DNS hostnames`
3. Nhấn **Save**.

---

## 2. Tạo Subnets

Chúng ta sẽ tạo **4 subnets** chia đều trên 2 AZ (`2a` và `2c`):

| Subnet Name | Availability Zone | CIDR | Loại Subnet |
| :--- | :--- | :--- | :--- |
| `nutritrack-api-vpc-public-alb01` | ap-southeast-2a | `10.0.1.0/24` | Public (Cho ALB & NAT 1) |
| `nutritrack-api-vpc-public-alb02` | ap-southeast-2c | `10.0.2.0/24` | Public (Cho ALB & NAT 2) |
| `nutritrack-api-vpc-private-ecs01` | ap-southeast-2a | `10.0.3.0/24` | Private (Cho ECS Tasks) |
| `nutritrack-api-vpc-private-ecs02` | ap-southeast-2c | `10.0.4.0/24` | Private (Cho ECS Tasks) |

**Lưu ý:** Sau khi tạo xong, hãy chọn 2 Public Subnet và bật tính năng **`Enable auto-assign public IPv4 address`** trong phần Subnet settings.

---

## 3. Internet Gateway & Route Tables

### 3.1 Internet Gateway (IGW)
1. Tạo IGW với tên `nutritrack-api-igw`.
2. Sau khi tạo, hãy **Attach to VPC** vào VPC `nutritrack-api-vpc`.

### 3.2 Public Route Table
1. Tạo Route Table tên `nutritrack-api-public-rt`.
2. Trong tab **Routes**, thêm route: `0.0.0.0/0` → Target là `Internet Gateway`.
3. Trong tab **Subnet associations**, gắn (associate) cả 2 Public Subnets vào đây.

### 3.3 Private Route Tables
Tạo 2 Route Table riêng biệt cho 2 AZ để sau này cấu hình NAT Instance HA:
- `nutritrack-api-private-rt-01` (Gắn với Private Subnet 01)
- `nutritrack-api-private-rt-02` (Gắn với Private Subnet 02)

---

## 4. Security Groups (SG)

Bạn cần tạo 3 Security Group theo thứ tự logic sau:

### 4.1 ALB Security Group (`nutritrack-api-vpc-alb-sg`)
- **Inbound Rule**: Cho phép `HTTP` (Port 80) từ `0.0.0.0/0`.
- **Lưu ý**: Sau khi triển khai xong Lambda, bạn nên đổi Source về SG của Lambda để bảo mật hơn.

### 4.2 ECS Security Group (`nutritrack-api-vpc-ecs-sg`)
- **Inbound Rule**: Chỉ cho phép `Custom TCP` (Port 8000) từ Source là `nutritrack-api-vpc-alb-sg`.
- **Outbound Rule**: Cho phép gửi traffic đến NAT SG và S3 Prefix List.

### 4.3 NAT Instance Security Group (`nutritrack-api-vpc-nat-sg`)
- **Inbound Rule**: Cho phép **All traffic** từ Source là `nutritrack-api-vpc-ecs-sg`. Cho phép `SSH` (Port 22) từ IP máy cá nhân của bạn.
- **Outbound Rule**: Cho phép **All traffic** ra `0.0.0.0/0`.

---

## 5. S3 Gateway VPC Endpoint (Miễn phí)

Giúp ECS Task truy cập S3 mà không cần đi qua Internet hay NAT.

1. Vào **Endpoints** → **Create endpoint**.
2. Chọn Service: `com.amazonaws.ap-southeast-2.s3` (loại **Gateway**).
3. Chọn cả 2 Private Route Tables để AWS tự động thêm route.
4. Nhấn **Create endpoint**.

---

## Các bước tiếp theo:

Sau khi hạ tầng mạng đã sẵn sàng, chúng ta sẽ chuẩn bị các tài nguyên lưu trữ và định danh:
- [5.5.2 Hạ tầng hỗ trợ (S3, Secrets, IAM)](../5.5.2-Infrastructure/)
- [5.5.3 Tối ưu hóa NAT (NAT Instance)](../5.5.3-NAT-Instance/)
- [5.5.4 Triển khai Fargate & ALB](../5.5.4-Fargate-ALB/)


## Hạ tầng hỗ trợ


Phần này hướng dẫn thiết lập ba thành phần hạ tầng quan trọng hỗ trợ cho cụm ECS Fargate: **S3 Bucket** để lưu trữ cache, **Secrets Manager** để quản lý API keys bảo mật, và **IAM Roles** để cấp quyền thực thi.

> **Điều kiện tiên quyết:** Đã hoàn thành [5.5.1 Hạ tầng Mạng (VPC & Network)](../5.5.1-VPC-Network/).

---

## 1. S3 Bucket (Cache Layer)

Chúng ta cần một S3 Bucket để cache kết quả từ các API bên ngoài (USDA, OpenFoodFacts, Avocavo). Việc này giúp giảm độ trễ và tiết kiệm chi phí gọi API.

### 1.1 Tạo S3 Bucket
1. Vào AWS Console → **S3** → **Create bucket**.
2. **Bucket name**: `nutritrack-cache-xxxx` (tên phải duy nhất toàn cầu, bạn nên thêm ngày tháng hoặc tên cá nhân).
3. **Region**: `ap-southeast-2`.
4. **Block all public access**: ✅ Bật (Mặc định).
5. Nhấn **Create bucket**.

---

## 2. Secrets Manager

Secrets Manager giúp lưu trữ API keys một cách an toàn và tự động inject vào container dưới dạng biến môi trường, tránh việc lộ plaintext trong mã nguồn.

### 2.1 Tạo Secret
1. Vào **Secrets Manager** → **Store a new secret**.
2. Chọn **Secret type**: `Other type of secret`.
3. Thêm các cặp **Key/value** sau:
   - `USDA_API_KEY`: <Key của bạn>
   - `AVOCAVO_API_KEY`: <Key của bạn>
   - `NUTRITRACK_API_KEY`: <Secret dùng chung cho JWT giữa Lambda và ECS>
4. Đặt tên Secret: `nutritrack/prod/api-keys`.
5. Sau khi lưu, hãy copy mã **ARN** của Secret này để dùng cho bước tiếp theo.

---

## 3. IAM Roles cho ECS

ECS sử dụng hai Role riêng biệt cho hai mục đích khác nhau:

| Role Name | Đối tượng sử dụng | Mục đích |
| :--- | :--- | :--- |
| **`ecsTaskExecutionRole`** | AWS ECS Agent | Pull Docker image, gửi log về CloudWatch, đọc Secrets Manager. |
| **`ecsTaskRole`** | Ứng dụng bên trong container | Gọi Amazon Bedrock, đọc/ghi dữ liệu vào S3 Cache. |

### 3.1 Cấu hình `ecsTaskExecutionRole`
1. Tìm hoặc tạo Role tên `ecsTaskExecutionRole`.
2. Đảm bảo Role đã có managed policy: `AmazonECSTaskExecutionRolePolicy`.
3. Thêm **Inline Policy** (JSON) để cho phép đọc Secret ARN đã copy ở trên:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": ["<YOUR_SECRET_ARN>"]
    }
  ]
}
```

### 3.2 Tạo `ecsTaskRole`
1. Tạo Role mới với Trusted Entity là `Elastic Container Service Task`.
2. Gắn **Inline Policy** cho phép truy cập Bedrock và S3 Bucket cache:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel", "bedrock:ListFoundationModels"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::nutritrack-cache-xxxx",
        "arn:aws:s3:::nutritrack-cache-xxxx/*"
      ]
    }
  ]
}
```

---

## Các bước tiếp theo:

Hạ tầng nền tảng đã sẵn sàng. Bây giờ chúng ta sẽ tối ưu hóa chi phí đường truyền internet:
- [5.5.3 Tối ưu hóa NAT (NAT Instance)](../5.5.3-NAT-Instance/)
- [5.5.4 Triển khai Fargate & ALB](../5.5.4-Fargate-ALB/)


## Tối ưu hóa NAT (NAT Instance)


## 1. Khởi tạo NAT Instance

Chúng ta sẽ sử dụng instance type `t4g.nano` (kiến trúc ARM Graviton) để tối ưu chi phí và hiệu năng.

1. Vào **EC2 Console** → **Launch Instances**.
2. **AMI**: Chọn **Amazon Linux 2023** (Bản 64-bit Arm).
3. **Instance Type**: `t4g.nano`.
4. **Network Settings**:
   - VPC: `nutritrack-api-vpc`
   - Subnet: `nutritrack-api-vpc-public-alb01` (Public Subnet)
   - Auto-assign Public IP: **Enable**
   - Security Group: `nutritrack-api-vpc-nat-sg`
5. **IAM instance profile**: Chọn `nutritrack-api-vpc-nat-instance-role`.
6. Nhấn **Launch instance**.

> [!IMPORTANT]
> Sau khi instance đã chạy, bạn **bắt buộc** phải tắt tính năng **Source/Destination Check**:
> Chọn Instance → **Actions** → **Networking** → **Change source/destination check** → Chọn **Stop**.

---

## 2. Cấu hình NAT (Script tự động)

Sau khi SSH hoặc dùng SSM để vào NAT Instance, bạn hãy chạy script sau để bật tính năng chuyển tiếp gói tin (IP Forwarding) và cấu hình Masquerade:

```bash
#!/bin/bash
# 1. Bật IP Forwarding
sudo sysctl -w net.ipv4.ip_forward=1

# 2. Cài đặt iptables-services
sudo dnf install iptables-services -y
sudo systemctl enable iptables
sudo systemctl start iptables

# 3. Cấu hình NAT Masquerade (Thay eth0 bằng interface thực tế nếu khác)
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables-save | sudo tee /etc/sysconfig/iptables
```

---

## 3. Cấu hình High Availability (ASG)

Để đảm bảo hệ thống không bị gián đoạn khi một NAT Instance gặp sự cố, chúng ta nên sử dụng **Auto Scaling Group (ASG)**.

ASG sẽ tự động phát hiện nếu instance bị lỗi và khởi tạo một instance mới thay thế. Bạn có thể sử dụng **User Data** trong Launch Template để tự động chạy các lệnh cấu hình trên và cập nhật Route Table trỏ về Instance ID mới.

> [!TIP]
> Bạn nên tạo mỗi AZ một ASG riêng biệt với `Desired Capacity = 1` để đảm bảo mỗi AZ luôn có đúng một NAT Instance hoạt động.

---

## Các bước tiếp theo:

Hạ tầng mạng và NAT đã sẵn sàng. Bước cuối cùng là triển khai ứng dụng của chúng ta:
- [5.5.4 Triển khai Fargate & ALB](../5.5.4-Fargate-ALB/)


## Triển khai Fargate & ALB


Đây là bước cuối cùng để hoàn thiện hệ thống: Build Docker image, đẩy lên registry, và thiết lập cụm ECS Fargate cùng Application Load Balancer (ALB) để phục vụ các yêu cầu từ internet.

## 1. Build & Push Docker Image

Chúng ta cần có một Docker Image chứa mã nguồn FastAPI (Python) được tối ưu cho kiến trúc ARM64 của AWS Graviton.

### Clone mã nguồn (Ví dụ)
```bash
git clone https://github.com/justHman/NUTRI_TRACK_API
cd NUTRI_TRACK_API
```

### Build và Push lên Docker Hub
```bash
# Đăng nhập Docker Hub
docker login

# Build multi-platform (ARM64) và push trực tiếp
docker buildx build \
  --platform linux/arm64 \
  --tag <username>/nutritrack-api:latest \
  --push .
```

---

## 2. Khởi tạo ECS Cluster

1. Vào **ECS Console** → **Clusters** → **Create cluster**.
2. **Cluster name**: `nutritrack-api-cluster`.
3. **Infrastructure**: Chọn `AWS Fargate (serverless)`.
4. Nhấn **Create**.

---

## 3. Định nghĩa Task (Task Definition)

Task Definition chỉ định image nào sẽ chạy, tài nguyên CPU/RAM và các biến môi trường cần thiết.

1. Vào **Task Definitions** → **Create new task definition**.
2. **OS/Architecture**: `Linux/ARM64` (Để tiết kiệm chi phí với Graviton).
3. **CPU**: `1 vCPU`, **Memory**: `2 GB`.
4. **Task Execution Role**: `ecsTaskExecutionRole`.
5. **Container Details**:
   - **Name**: `nutritrack-api-container`
   - **Image**: `<username>/nutritrack-api:latest`
   - **Port mapping**: `8000` (TCP).
6. **Environment variables**: Inject các API Keys từ Secrets Manager sử dụng cú pháp `ValueFrom`.

---

## 4. Application Load Balancer (ALB)

ALB đóng vai trò tiếp nhận traffic từ người dùng và phân phối đến các container của ECS.

1. **Target Group**: Tạo Target Group tên `nutritrack-api-tg`, port 8000, type **IP**. Health check path: `/health`.
2. **Load Balancer**: Tạo ALB loại **Internet-facing**, chọn các Public Subnet đã tạo ở bước 5.5.1.
3. **Security Group**: Gắn `nutritrack-api-vpc-alb-sg`.
4. **Listener**: Chuyển hướng traffic từ port 80 sang Target Group vừa tạo.

---

## 5. Cấu hình Bảo mật với AWS WAF

Hãy chèn thêm một lớp bảo mật (WAF) để ngăn chặn các cuộc tấn công brute-force và đảm bảo chỉ Lambda `scan-image` mới có quyền gọi đến ALB.

- **Rate Limit**: Giới hạn mỗi IP tối đa 100 request trong 5 phút.
- **Custom Header**: Chỉ chấp nhận request có header `Authorization: Bearer <token>`.

---

## 6. ECS Service

Cuối cùng, hãy tạo Service để duy trì số lượng task luôn chạy.

1. Vào Cluster → tab **Services** → **Create**.
2. **Capacity Provider**: `FARGATE_SPOT` (Để tối ưu chi phí tối đa).
3. **Deployment Configuration**: Chọn Task Definition vừa tạo.
4. **Networking**: Chọn 2 Private Subnets và Security Group của ECS.
5. **Load Balancing**: Chọn ALB và Target Group đã thiết lập.
6. Nhấn **Create**.

---

## Kết quả đạt được:

Hệ thống của bạn hiện đã hoàn thiện:
- Một Mobile App kết nối với Amplify Gen 2.
- Các tác vụ AI nặng được xử lý bởi FastAPI trên ECS Fargate.
- Toàn bộ được bảo mật trong một VPC riêng với NAT tối ưu chi phí.

---

[Tiếp tục đến 6.0 Tổng kết & Tài liệu tham khảo](../../6-Conclusion/)


## 


# CI/CD — Triển khai Tự động hóa

Trong một dự án AI Production, việc tự động hóa (CI/CD) không chỉ giúp tiết kiệm thời gian mà còn đảm bảo hạ tầng Cloud luôn đồng bộ với mã nguồn. Chúng ta sẽ sử dụng **AWS Amplify Console** kết nối trực tiếp với Repo GitHub.

## 1. Kết nối Nhánh (Branch Strategy)
Kết nối các nhánh GitHub tương ứng với các môi trường AWS:
- **`main`**: Triển khai môi trường **Production**.
- **`staging`**: (Tùy chọn) Triển khai cho đội ngũ QA.
- **`sandbox`**: Dành cho phát triển cá nhân (thường sử dụng lệnh `npx ampx sandbox`).

## 2. Cấu hình Build (`amplify.yml`)

Dưới đây là tệp cấu hình `amplify.yml` nâng cao, được tối ưu hóa để build cả Backend (CDK) và Frontend (Expo) trong cùng một lượt. 

> [!IMPORTANT]
> Lưu ý phần cài đặt Lambda: Chúng ta cần `cd` vào từng thư mục hàm để cài đặt dependencies riêng biệt trước khi Amplify thực hiện đóng gói.

```yaml
version: 1
backend:
  phases:
    build:
     commands:
        - cd backend
        - npm install --legacy-peer-deps --include=dev

        - cd amplify/ai-engine
        - npm install --include=dev
        - cd ../..

        - cd amplify/process-nutrition
        - npm install --include=dev
        - cd ../..

        - cd amplify/friend-request
        - npm install --include=dev
        - cd ../..

        - cd amplify/resize-image
        - rm -rf node_modules package-lock.json
        - npm install --platform=linux --arch=x64 sharp
        - npm install --legacy-peer-deps
        - cd ../..

        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID --outputs-out-dir ../frontend
        - cd ..
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend && npm install --legacy-peer-deps && cd ..
    build:
      commands:
        - cd frontend && npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - "**/*"
  cache:
    paths:
      - frontend/node_modules/**/*
      - frontend/.expo/**/*
  customRules:
    - source: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>
      target: /index.html
      status: '200'
  customHeaders:
    - pattern: "**/*.html"
      headers:
        - key: Cache-Control
          value: no-cache
    - pattern: "**/*.js"
      headers:
        - key: Cache-Control
          value: public, max-age=31536000, immutable
    - pattern: "**/*.css"
      headers:
        - key: Cache-Control
          value: public, max-age=31536000, immutable
    - pattern: "**/*.(png|jpg|jpeg|svg|webp)"
      headers:
        - key: Cache-Control
          value: public, max-age=31536000, immutable
    - pattern: "**/*.(woff|woff2|ttf)"
      headers:
        - key: Cache-Control
          value: public, max-age=31536000, immutable
```

## 3. Tối ưu hóa & Lưu ý kỹ thuật

### Giải quyết xung đột Dependency
Vì dự án sử dụng **Expo 54** và **React 19**, bạn có thể gặp lỗi `peer dependency conflict`. Hãy luôn sử dụng cờ `--legacy-peer-deps` trong các lệnh cài đặt để đảm bảo quá trình build thành công.

---

## 3. Chỉnh sửa cấu hình Build trên Console

Sau khi kết nối dự án với GitHub, bạn cần cập nhật nội dung `amplify.yml` đã chuẩn bị ở trên vào AWS Console:

1. Truy cập [AWS Amplify Console](https://console.aws.amazon.com/amplify).
2. Chọn ứng dụng của bạn.
3. Ở menu bên trái, chọn **App settings** -> **Build settings**.
4. Nhấn nút **Edit** ở góc phải phần **Build specification**.
5. Dán nội dung YAML ở mục 2 vào và nhấn **Save**.

## 4. Đồng bộ môi trường Local (`amplify_outputs.json`)

Tệp `amplify_outputs.json` là "cầu nối" giúp ứng dụng Frontend biết được các Endpoint của Backend (API, Auth, Storage). Trong quá trình CI/CD, Amplify tự động tạo file này, nhưng để lập trình ở máy cá nhân (Local), bạn cần tải nó về theo cách thủ công.

### Câu lệnh đồng bộ:
Mở terminal tại thư mục dự án và chạy:

```bash
npx ampx generate outputs --branch <tên-nhánh> --app-id <app-id-của-bạn>
```

> [!TIP]
> Bạn có thể tìm thấy **App ID** ngay tại trang Overview của dự án trên Amplify Console.

> [!CAUTION]
> Tuyệt đối không đẩy tệp `amplify_outputs.json` lên GitHub để tránh lộ thông tin endpoint và API Keys.

---

[Tiếp tục đến 5.7 Dọn dẹp](../5.7-Cleanup/)


