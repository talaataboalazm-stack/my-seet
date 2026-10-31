# My Seet — دليل التشغيل خطوة بخطوة

المشروع فيه **ثلاث أجزاء**:

| الجزء | الوصف |
|---|---|
| تطبيق العميل (`npm run build`) | يتحول لـ APK أندرويد وتطبيق آيفون بواسطة Capacitor |
| لوحة الإدارة (`npm run build:admin`) | موقع ويب منفصل تفتحه أنت والموظفين فقط (Firebase Hosting) |
| الخادم | Firebase: تسجيل الدخول + قاعدة البيانات + الإشعارات (Functions) |

> بدون ضبط Firebase يعمل التطبيق في **وضع تجريبي** (بيانات داخل الجهاز فقط) — للتجربة وليس للتشغيل الفعلي.
> حسابات التجربة: عميل `demo / 1234` — إدارة `admin / Seet@2026`.

## 1) إنشاء مشروع Firebase (حساب جوجل فقط)
1. ادخل https://console.firebase.google.com ← **Add project** ← سمّه `my-seet`.
2. **Build → Authentication → Get started → Email/Password → Enable**.
3. **Build → Firestore Database → Create database** (اختر موقعًا قريبًا مثل `me-central2` أو `europe-west`)، وضع Production.
4. **Project settings → General → Your apps → Web (</>)** سجّل تطبيق ويب باسم `my-seet-web` وانسخ `firebaseConfig`.
5. **Project settings → Your apps → Android**: الـ package name = `app.myseet.client` ← نزّل `google-services.json`.
6. الإشعارات و Functions تحتاج ترقية المشروع إلى **Blaze** (دفع حسب الاستخدام، وفيه حصة مجانية تكفي غالبًا شركة بحجمك).

## 2) إنشاء حساب الإدارة
1. **Authentication → Users → Add user**: ضع بريدك وكلمة مرور قوية، وانسخ **User UID**.
2. **Firestore → Start collection** باسم `admins` ← Document ID = الـ UID الذي نسخته ← أضف أي حقل (مثلًا `role: "owner"`).
3. لإضافة موظف: كرر الخطوتين لبريده.

## 3) لوحة الإدارة على الويب
على جهاز كمبيوتر فيه Node 20:
```bash
npm install
# الصق firebaseConfig داخل src/firebase-config.js
npm install -g firebase-tools && firebase login
firebase use --add          # اختر مشروعك
cd functions && npm install && cd ..
npm run deploy:admin
```
يطبع Firebase رابط الموقع مثل `https://my-seet.web.app` — هذا رابط لوحة الإدارة. (يمكنك ربط دومين مثل `admin.seetpestcontrol.com.sa` من Hosting.)

## 4) ملف APK (بدون كمبيوتر تقريبًا، عبر GitHub)
1. أنشئ حساب مجاني على https://github.com ثم **New repository** (Private).
2. ارفع محتوى هذا المجلد (Add file → Upload files).
3. في المستودع: **Settings → Secrets and variables → Actions → New secret**:
   - `FIREBASE_WEB_CONFIG_JSON` = كائن الإعدادات بصيغة JSON، مثال: `{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}`
   - `GOOGLE_SERVICES_JSON` = محتوى ملف `google-services.json` كاملًا.
4. تبويب **Actions → Build Android APK → Run workflow**.
5. بعد ~10 دقائق نزّل `My-Seet-apk` من نتائج التشغيل وفيه الـ APK. شاركه مع العملاء مباشرة أو انشره على Google Play لاحقًا (يحتاج حساب مطور Play وتوقيع Release).

## 5) آيفون
يتطلب: حساب **Apple Developer** (99$ سنويًا) + جهاز Mac أو خدمة بناء سحابية (مثل Codemagic / GitHub macOS runner).
```bash
npx cap add ios && npm run build && npx cap sync ios && npx cap open ios
```
ثم فعّل Push Notifications و Background Modes في Xcode، وارفع مفتاح APNs في Firebase (Project settings → Cloud Messaging)، وأضف `GoogleService-Info.plist`.

## 6) الاستخدام اليومي
- من لوحة الإدارة: **العملاء** ← إضافة عميل (اسم + اسم مستخدم إنجليزي + كلمة مرور 6 أحرف فأكثر) وأعطه بياناته.
- **تقرير**: اختر العميل واملأ بيانات الزيارة ← نشر. يصل العميل إشعار بصوت فورًا ويظهر التقرير في حسابه.
- **زيارة**: حدد موعد الزيارة القادمة ← يصله إشعار أيضًا.
- العميل لا يملك أي صلاحية كتابة؛ قواعد الأمان في `firestore.rules` تمنعه حتى لو حاول.

## أمان
- لا تضع حساب الإدارة في تطبيق العميل: النسخة العميل (`dist`) لا تحتوي أي شاشة إدارة.
- غيّر كلمات مرور الإدارة بشكل دوري، وفعّل التحقق بخطوتين لحساب جوجل المالك.
