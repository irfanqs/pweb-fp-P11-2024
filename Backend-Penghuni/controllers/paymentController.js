const Payment = require('../models/Payment');
// const Invoice = require('../models/Invoice');
const { use } = require('../routes/authRoutes');
const fs = require('fs');
const PDFDocument = require('pdfkit');



function generateInvoice(payment) {
    return new Promise((resolve, reject) => {
        const formattedPayment = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(payment.totalAmount);

        // Membuat dokumen PDF
        const doc = new PDFDocument();

        // Tentukan lokasi file PDF
        const filePath = `${payment.username}_invoice.pdf`;
        
        // Menyimpan PDF ke file
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Menambahkan konten ke PDF
		doc.fontSize(18).text('Invoice', { align: 'center' });
		doc.moveDown(1);
		doc.fontSize(12).text(`Username: ${payment.username}`);
		doc.text(`Period: ${payment.period} months`);
		doc.text(`Total Amount: ${formattedPayment}`);
		doc.text(`Payment Method: ${payment.paymentMethod}`); 
		// Menambahkan bank name jika payment method bukan QRIS
		if (payment.paymentMethod !== 'QRIS') {
			doc.text(`Bank Name: ${payment.bankName}`);
		} 
		doc.text(`Status: ${payment.status}`);
		doc.text(`Date: ${new Date(payment.date).toLocaleString()}`);
		doc.moveDown(1);

        doc.text('Extras:', { underline: true });
        payment.extras.forEach(extra => {
            doc.text(`- ${extra}`);
        });

        // Menyelesaikan pembuatan PDF
        doc.end();

        // Menunggu hingga PDF selesai ditulis
        writeStream.on('finish', () => {
            resolve(filePath);  // Resolusi setelah file selesai ditulis
        });

        // Tangani error jika terjadi
        writeStream.on('error', (err) => {
            reject(err);  // Menangani error dalam pembuatan file
        });
    });
}

// Controller untuk membuat pembayaran
exports.makePayment = async (req, res) => {
  try {
    const { username, period, extras, totalAmount, paymentMethod ,bankName} = req.body;

    // Validasi input
    if (!username || !period || !extras || !totalAmount || !paymentMethod) {
      return res.status(400).json({ error: 'All fields are required' });
    }
	if (paymentMethod != 'QRIS') {
		var payment = new Payment({
			username,
			totalAmount,
			paymentMethod,
			extras,
			bankName,
			period,
			status: 'Paid',
		  });
	} else{
		var payment = new Payment({
			username,
			totalAmount,
			paymentMethod,
			extras,
			period,
			status: 'Paid',
		  });
	}

    // Simpan pembayaran
    await payment.save();

    // Tunggu sampai invoice selesai dibuat
    await generateInvoice(payment);

    // Tentukan path file invoice
    const filePath = username + '_invoice.pdf';

    // Cek apakah file sudah ada sebelum membaca
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath); // Membaca file secara sinkron

      // Mengubah buffer ke Base64
      const base64String = data.toString('base64');

      // Mengirimkan response
      res.status(201).json({
        message: 'Payment successfully created',
        invoice: base64String,
      });
    } else {
      // Jika file belum ada, beri response error
      return res.status(500).json({
        message: 'Invoice file not found',
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
	const {username} = req.body;
	const payments = await Payment.find({username});
	res.status(200).json(payments);
  } catch (err) {
	res.status(500).json({ error: err.message });
  }
};

