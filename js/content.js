/*
  كل نصوص وإعدادات الموقع هنا (عربي / إنجليزي). لإعادة استخدام القالب لعيادة أخرى: غيّر CONFIG وT واللون في css (--teal).
  لا توجد تقييمات أو أرقام مبيعات أو ادّعاءات: أضِف فقط ما تؤكده العيادة فعلاً.
*/
export const CONFIG = {
  BRAND: 'MOHAMMED',
  WA_NUMBER: '',            // بالصيغة الدولية بدون + (مثال 905xxxxxxxxx). فارغ = يفتح واتساب ليختار المستخدم جهة الاتصال
  PHONE: '',                // مثال +905xxxxxxxxx (فارغ = يُخفى زر الاتصال)
  PHONE_DISPLAY: '',
  CREDIT: 'Muhammed Elhuseyin',
  DEFAULT_LANG: 'ar',
  YEAR: 2026
};

export const SERVICE_IDS = ['check', 'whitening', 'implant', 'braces', 'root', 'veneer', 'kids', 'emergency'];
export const DOCTOR_IDS = ['layla', 'omar', 'sara'];

export const T = {
  ar: {
    dir: 'rtl', lang: 'ar', switchTo: 'English',
    title: 'MOHAMMED · عيادة أسنان',
    desc: 'عيادة أسنان: كشف وتنظيف، تبييض، زراعة، تقويم، علاج عصب وأسنان أطفال. احجز موعدك بسهولة عبر واتساب.',
    brand: 'محمد', brandSub: 'للأسنان',
    skip: 'تخطَّ إلى المحتوى',
    nav: { services: 'الخدمات', steps: 'كيف تتم الزيارة', doctors: 'الأطباء', faq: 'أسئلة شائعة', book: 'الحجز' },
    cta: 'احجز موعدك',
    hero: {
      kicker: 'عيادة أسنان',
      h1a: 'ابتسامتك', h1b: 'بين أيدٍ أمينة',
      sub: 'كشف واضح، خطة علاج مفهومة، وتجربة هادئة بلا قلق. نشرح لك كل خطوة قبل أن نبدأ.',
      cta2: 'تعرّف على خدماتنا',
      points: ['مواعيد مرنة صباحاً ومساءً', 'خطة علاج وتكلفة واضحة قبل البدء', 'عناية خاصة بالأطفال'],
      chip1: 'كشف وتشخيص دقيق', chip2: 'بدون مفاجآت في التكلفة'
    },
    services: {
      kicker: 'خدماتنا', h2: 'كل ما تحتاجه ابتسامتك في مكان واحد',
      items: {
        check: ['الكشف والتنظيف', 'فحص شامل وتنظيف احترافي للحفاظ على صحة الفم.'],
        whitening: ['تبييض الأسنان', 'ابتسامة أفتح بخطوات آمنة وبإشراف الطبيب.'],
        implant: ['زراعة الأسنان', 'تعويض الأسنان المفقودة بحلّ ثابت ومريح.'],
        braces: ['تقويم الأسنان', 'تقويم تقليدي أو شفاف حسب حالتك.'],
        root: ['علاج العصب', 'إنقاذ السنّ المتضرر وتخفيف الألم بخطوات دقيقة.'],
        veneer: ['الفينير وتجميل الابتسامة', 'تحسين شكل الأسنان ولونها بتصميم يناسب وجهك.'],
        kids: ['أسنان الأطفال', 'بيئة لطيفة تجعل الزيارة الأولى تجربة جميلة.'],
        emergency: ['الحالات الطارئة', 'ألم مفاجئ أو كسر؟ نستقبلك في أقرب موعد ممكن.']
      },
      book: 'احجز'
    },
    steps: {
      kicker: 'كيف تتم الزيارة', h2: 'أربع خطوات واضحة',
      items: [
        ['احجز', 'اختر الوقت المناسب عبر النموذج أو واتساب.'],
        ['الفحص', 'كشف وتصوير عند الحاجة لفهم حالتك بدقة.'],
        ['الخطة', 'نشرح لك الخيارات والتكلفة قبل أي إجراء.'],
        ['العلاج والمتابعة', 'ننفّذ الخطة معك ونتابع حالتك بعدها.']
      ]
    },
    doctors: {
      kicker: 'الأطباء', h2: 'فريق أطباء مختصّين',
      items: {
        layla: ['د. ليلى', 'تقويم الأسنان'],
        omar: ['د. عمر', 'زراعة الأسنان وجراحة الفم'],
        sara: ['د. سارة', 'أسنان الأطفال']
      },
      langs: 'العربية · English', bookWith: 'احجز مع'
    },
    faq: {
      kicker: 'أسئلة شائعة', h2: 'نجيب عن أكثر ما يُسأل',
      items: [
        ['كم مرة أحتاج لفحص الأسنان؟', 'عادةً كل ستة أشهر، وقد ينصحك طبيبك بموعد مختلف حسب حالتك.'],
        ['هل تبييض الأسنان آمن؟', 'عندما يتم بإشراف طبيب بعد فحص الأسنان واللثة يكون خياراً شائعاً وآمناً في الغالب، وسيحدد الطبيب إن كان مناسباً لك.'],
        ['هل علاج العصب مؤلم؟', 'يتم العلاج بتخدير موضعي، والهدف إزالة الألم الناتج عن الالتهاب. قد تشعر بحساسية بسيطة بعد الجلسة وتزول عادةً خلال أيام.'],
        ['متى أبدأ تقويم الأسنان؟', 'لا يوجد عمر واحد مناسب للجميع؛ يقيّم الطبيب حالتك أولاً ويحدد التوقيت والنوع المناسب.'],
        ['ماذا أفعل عند ألم الأسنان المفاجئ؟', 'تواصل معنا بأسرع وقت لنحدد لك أقرب موعد. وفي الأثناء يمكنك المضمضة بماء فاتر وتجنّب الأطعمة شديدة البرودة أو السخونة.']
      ],
      note: 'معلومات عامة؛ الطبيب هو من يحدد الأنسب لحالتك.'
    },
    book: {
      kicker: 'الحجز', h2: 'احجز موعدك', lead: 'املأ النموذج وسيصلنا طلبك على واتساب. نؤكد معك الموعد بأقرب وقت.',
      name: 'الاسم', phone: 'رقم الهاتف', service: 'الخدمة', serviceAny: 'اختر الخدمة', doctor: 'الطبيب', doctorAny: 'أي طبيب متاح',
      date: 'التاريخ المفضل', time: 'الوقت', times: ['صباحاً (9–12)', 'ظهراً (12–4)', 'مساءً (4–8)'], note: 'ملاحظات (اختياري)',
      send: 'أرسل الطلب عبر واتساب', privacy: 'بياناتك تُرسل مباشرة إلى واتساب العيادة فقط.',
      errName: 'اكتب اسمك', errPhone: 'اكتب رقم هاتف صحيح', sent: 'جاهز! أكمل الإرسال من واتساب.'
    },
    visit: {
      h3: 'زيارتنا', address: 'العنوان', addressV: 'شارع الأمل، الطابق الثاني',
      hours: 'ساعات العمل', hoursV: 'السبت – الخميس · 10:00 – 20:00',
      phone: 'الهاتف', whatsapp: 'واتساب', waV: 'راسلنا الآن', call: 'اتصال'
    },
    wa: {
      hello: 'مرحباً، أرغب بحجز موعد في عيادة محمد للأسنان.', name: 'الاسم', phone: 'الهاتف', service: 'الخدمة', doctor: 'الطبيب', date: 'التاريخ المفضل', time: 'الوقت', note: 'ملاحظات',
      generic: 'مرحباً، أرغب بالاستفسار عن موعد في عيادة محمد للأسنان.'
    },
    footer: { tag: 'عناية تبدأ بابتسامة.', rights: 'جميع الحقوق محفوظة', credit: 'تصميم وتطوير' },
    bar: { book: 'احجز', wa: 'واتساب', call: 'اتصال' },
    menu: 'القائمة'
  },

  en: {
    dir: 'ltr', lang: 'en', switchTo: 'العربية',
    title: 'MOHAMMED · Dental Clinic',
    desc: 'Dental clinic: check-ups and cleaning, whitening, implants, braces, root canal and kids\' dentistry. Book your visit easily on WhatsApp.',
    brand: 'MOHAMMED', brandSub: 'Dental',
    skip: 'Skip to content',
    nav: { services: 'Services', steps: 'Your visit', doctors: 'Doctors', faq: 'FAQ', book: 'Book' },
    cta: 'Book a visit',
    hero: {
      kicker: 'Dental clinic',
      h1a: 'Your smile,', h1b: 'in careful hands',
      sub: 'A clear check-up, a treatment plan you understand, and a calm visit with no worry. We explain every step before we start.',
      cta2: 'See our services',
      points: ['Flexible morning and evening hours', 'A clear plan and cost before we begin', 'Gentle care for children'],
      chip1: 'Careful diagnosis', chip2: 'No surprises on cost'
    },
    services: {
      kicker: 'Our services', h2: 'Everything your smile needs, in one place',
      items: {
        check: ['Check-up & cleaning', 'A full exam and professional cleaning to keep your mouth healthy.'],
        whitening: ['Teeth whitening', 'A brighter smile through safe steps, supervised by your dentist.'],
        implant: ['Dental implants', 'Replace missing teeth with a fixed, comfortable solution.'],
        braces: ['Braces & aligners', 'Traditional or clear aligners, chosen for your case.'],
        root: ['Root canal', 'Save a damaged tooth and relieve pain with careful steps.'],
        veneer: ['Veneers & smile design', 'Improve the shape and shade of your teeth with a design that suits your face.'],
        kids: ['Kids\' dentistry', 'A gentle setting that makes the first visit a good one.'],
        emergency: ['Dental emergencies', 'Sudden pain or a broken tooth? We see you at the earliest slot.']
      },
      book: 'Book'
    },
    steps: {
      kicker: 'Your visit', h2: 'Four clear steps',
      items: [
        ['Book', 'Pick a time on the form or over WhatsApp.'],
        ['Examine', 'An exam, with x-rays when needed, to understand your case.'],
        ['Plan', 'We walk you through the options and cost before any procedure.'],
        ['Treat & follow up', 'We carry out the plan with you and check in afterwards.']
      ]
    },
    doctors: {
      kicker: 'Doctors', h2: 'A team of specialists',
      items: {
        layla: ['Dr. Layla', 'Orthodontics'],
        omar: ['Dr. Omar', 'Implants & oral surgery'],
        sara: ['Dr. Sara', 'Pediatric dentistry']
      },
      langs: 'العربية · English', bookWith: 'Book with'
    },
    faq: {
      kicker: 'FAQ', h2: 'Answers to common questions',
      items: [
        ['How often should I have a check-up?', 'Usually every six months, though your dentist may suggest a different schedule for you.'],
        ['Is teeth whitening safe?', 'When done under a dentist\'s supervision after checking teeth and gums, it is a common and generally safe option; your dentist will say whether it suits you.'],
        ['Does a root canal hurt?', 'It is done under local anaesthesia, and its aim is to remove the pain caused by infection. You may feel mild sensitivity afterwards, which usually fades within days.'],
        ['When should braces start?', 'There is no single right age; the dentist first assesses your case and then recommends the timing and type.'],
        ['What if I get sudden tooth pain?', 'Contact us as soon as you can and we will find the earliest slot. Meanwhile, rinse with lukewarm water and avoid very hot or very cold food.']
      ],
      note: 'General information only; your dentist decides what is best for your case.'
    },
    book: {
      kicker: 'Booking', h2: 'Book your visit', lead: 'Fill in the form and your request reaches us on WhatsApp. We confirm your slot as soon as possible.',
      name: 'Name', phone: 'Phone number', service: 'Service', serviceAny: 'Choose a service', doctor: 'Doctor', doctorAny: 'Any available doctor',
      date: 'Preferred date', time: 'Time', times: ['Morning (9–12)', 'Afternoon (12–4)', 'Evening (4–8)'], note: 'Notes (optional)',
      send: 'Send request on WhatsApp', privacy: 'Your details go straight to the clinic\'s WhatsApp only.',
      errName: 'Please enter your name', errPhone: 'Please enter a valid phone number', sent: 'Ready! Finish sending in WhatsApp.'
    },
    visit: {
      h3: 'Visit us', address: 'Address', addressV: 'Al Amal Street, 2nd floor',
      hours: 'Opening hours', hoursV: 'Sat – Thu · 10:00 – 20:00',
      phone: 'Phone', whatsapp: 'WhatsApp', waV: 'Message us now', call: 'Call'
    },
    wa: {
      hello: 'Hello, I would like to book a visit at MOHAMMED Dental Clinic.', name: 'Name', phone: 'Phone', service: 'Service', doctor: 'Doctor', date: 'Preferred date', time: 'Time', note: 'Notes',
      generic: 'Hello, I would like to ask about an appointment at MOHAMMED Dental Clinic.'
    },
    footer: { tag: 'Care that starts with a smile.', rights: 'All rights reserved', credit: 'Designed & developed by' },
    bar: { book: 'Book', wa: 'WhatsApp', call: 'Call' },
    menu: 'Menu'
  }
};
