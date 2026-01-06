package com.school.erp.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.school.erp.entity.Certificate;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class CertificatePdfGenerator {

    public byte[] generateCertificate(Certificate cert) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            PdfContentByte canvas = writer.getDirectContent();

            // ================= BORDER =================
            Rectangle border = new Rectangle(36, 36, 559, 806);
            border.setBorder(Rectangle.BOX);
            border.setBorderWidth(3);
            border.setBorderColor(new Color(63, 81, 181)); // Indigo
            canvas.rectangle(border);

            // ================= FONTS =================
            Font titleFont = new Font(Font.HELVETICA, 28, Font.BOLD, new Color(63, 81, 181));
            Font subtitleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 14);
            Font nameFont = new Font(Font.HELVETICA, 22, Font.BOLD, Color.BLACK);
            Font footerFont = new Font(Font.HELVETICA, 12, Font.ITALIC);

            // ================= CONTENT =================
            Paragraph spacer = new Paragraph("\n\n");

            Paragraph title = new Paragraph("CERTIFICATE OF ACHIEVEMENT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);

            Paragraph school = new Paragraph("School ERP System", subtitleFont);
            school.setAlignment(Element.ALIGN_CENTER);

            Paragraph line = new Paragraph("__________________________________________");
            line.setAlignment(Element.ALIGN_CENTER);

            Paragraph body1 = new Paragraph(
                    "This is to proudly certify that",
                    normalFont
            );
            body1.setAlignment(Element.ALIGN_CENTER);

            Paragraph studentName = new Paragraph(
                    cert.getStudent().getName(),
                    nameFont
            );
            studentName.setAlignment(Element.ALIGN_CENTER);

            Paragraph body2 = new Paragraph(
                    "has successfully earned the",
                    normalFont
            );
            body2.setAlignment(Element.ALIGN_CENTER);

            Paragraph certType = new Paragraph(
                    cert.getType(),
                    subtitleFont
            );
            certType.setAlignment(Element.ALIGN_CENTER);

            Paragraph body3 = new Paragraph(
                    "for outstanding performance and dedication.",
                    normalFont
            );
            body3.setAlignment(Element.ALIGN_CENTER);

            Paragraph date = new Paragraph(
                    "\nIssued on: " +
                            cert.getIssuedDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    normalFont
            );
            date.setAlignment(Element.ALIGN_CENTER);

            // ================= FOOTER =================
            Paragraph footer = new Paragraph(
                    "\n\nAuthorized By\nSchool Administration",
                    footerFont
            );
            footer.setAlignment(Element.ALIGN_RIGHT);

            // ================= ADD TO DOCUMENT =================
            document.add(spacer);
            document.add(title);
            document.add(spacer);
            document.add(school);
            document.add(line);
            document.add(spacer);
            document.add(body1);
            document.add(spacer);
            document.add(studentName);
            document.add(spacer);
            document.add(body2);
            document.add(spacer);
            document.add(certType);
            document.add(spacer);
            document.add(body3);
            document.add(spacer);
            document.add(date);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }
}
