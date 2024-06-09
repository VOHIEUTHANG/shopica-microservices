﻿using Payment.API.DTOs.Transactions;
using Payment.API.Models.Enums;

namespace Payment.API.DTOs.Payments
{
    public class PaymentCreateRequest
    {
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public int PaymentMethodId { get; set; }
        public PaymentStatus paymentStatus { get; set; }
        public int CustomerId { get; set; }
        public IEnumerable<TransactionCreateRequest> Transactions { get; set; }
    }
}
