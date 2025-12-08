let certificates = [
  {
    id: 1,
    studentName: "John Doe",
    className: "10-A",
    type: "Character Certificate",
    issueDate: "2025-06-15",
    remarks: "Good conduct",
  },
];

export async function getAllCertificates() {
  return certificates;
}

export async function createCertificate(cert) {
  const id = Date.now();
  const newCert = { ...cert, id };
  certificates.push(newCert);
  return newCert;
}

export async function updateCertificate(id, updates) {
  certificates = certificates.map((c) =>
    c.id === id ? { ...c, ...updates } : c
  );
  return certificates.find((c) => c.id === id);
}

export async function deleteCertificate(id) {
  certificates = certificates.filter((c) => c.id !== id);
}
