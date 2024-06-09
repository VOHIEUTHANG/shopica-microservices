﻿namespace Payment.API.DTOs.PaymentMethods
{
    public class PaymentMethodCreateRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
        public string ImageUrl { get; set; }
    }
}