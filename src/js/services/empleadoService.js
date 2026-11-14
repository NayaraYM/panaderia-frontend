import { db, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from '../api/firebase.js';

// Referencia a la colección 'empleados' en Cloud Firestore
const EMPLEADOS_REF = collection(db, "empleados");

// 1. Listar todos los empleados
export async function listarEmpleados() {
    const snapshot = await getDocs(EMPLEADOS_REF);
    return snapshot.docs.map(documento => ({
        id: documento.id,
        ...documento.data()
    }));
}

// 2. Crear un nuevo empleado
export async function crearEmpleado(empleado) {
    const docRef = await addDoc(EMPLEADOS_REF, empleado);
    return { id: docRef.id, ...empleado };
}

// 3. Actualizar un empleado existente
export async function actualizarEmpleado(id, empleado) {
    const docRef = doc(db, "empleados", id);
    await updateDoc(docRef, empleado);
    return { id, ...empleado };
}

// 4. Eliminar un empleado
export async function eliminarEmpleado(id) {
    const docRef = doc(db, "empleados", id);
    await deleteDoc(docRef);
}