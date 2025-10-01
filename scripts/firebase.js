
// firebase.js — Firebase config + Firestore persistence with localStorage fallback

// 1) Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCnV3f-RkG5rH23zM9v8htNCfU_8ilEO4Y",
  authDomain: "ausara---production-app.firebaseapp.com",
  projectId: "ausara---production-app",
  storageBucket: "ausara---production-app.firebasestorage.app",
  messagingSenderId: "223966722697",
  appId: "1:223966722697:web:3ed54940a2211fa1a52458",
  measurementId: "G-12ZZVM0TCK"
};

// 2) Initialize Firebase (compat)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 3) App wiring: override loadData/saveData and expose an initializer
function initializeFirebase() {
  const STATE_DOC = db.collection('ausara_planner').doc('state_default'); // Change doc id per user if needed

  // Load: try Firestore; if empty -> seed from localStorage
  window.loadData = async function() {
    try {
      const snap = await STATE_DOC.get();
      if (snap.exists) {
        const data = snap.data();
        window.projects  = data.projects  || [];
        window.employees = data.employees || [];
        window.schedule  = data.schedule  || {};
      } else {
        // Seed from local if present
        window.projects  = JSON.parse(localStorage.getItem('ausara_projects') || '[]');
        window.employees = JSON.parse(localStorage.getItem('ausara_employees') || '[]');
        window.schedule  = JSON.parse(localStorage.getItem('ausara_schedule') || '{}');
        await STATE_DOC.set({
          projects:  window.projects,
          employees: window.employees,
          schedule:  window.schedule,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.error('Firestore load error:', err);
      // Last resort: fallback to local to keep UI usable
      window.projects  = JSON.parse(localStorage.getItem('ausara_projects') || '[]');
      window.employees = JSON.parse(localStorage.getItem('ausara_employees') || '[]');
      window.schedule  = JSON.parse(localStorage.getItem('ausara_schedule') || '{}');
    }
  };

  // Save: write to Firestore + mirror to local
  window.saveData = async function(elementToAnimate) {
    try {
      await STATE_DOC.set({
        projects:  window.projects  || [],
        employees: window.employees || [],
        schedule:  window.schedule  || {},
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Mirror to localStorage
      localStorage.setItem('ausara_projects', JSON.stringify(window.projects  || []));
      localStorage.setItem('ausara_employees', JSON.stringify(window.employees || []));
      localStorage.setItem('ausara_schedule', JSON.stringify(window.schedule  || {}));

      if (elementToAnimate) {
        elementToAnimate.style.opacity = '1';
        setTimeout(() => elementToAnimate.style.opacity = '0', 1200);
      }
    } catch (err) {
      console.error('Firestore save error:', err);
      alert('บันทึกลง Firestore ไม่สำเร็จ — มีการบันทึกไว้ในเครื่องชั่วคราวแล้ว');
      // Mirror local anyway
      localStorage.setItem('ausara_projects', JSON.stringify(window.projects  || []));
      localStorage.setItem('ausara_employees', JSON.stringify(window.employees || []));
      localStorage.setItem('ausara_schedule', JSON.stringify(window.schedule  || {}));
    }
  };
}

// Expose init for index.html
window.initializeFirebase = initializeFirebase;
