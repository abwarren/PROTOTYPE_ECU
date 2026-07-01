# 👥 Customer Workflow

> **Audience:** Workshop staff
> **Last updated:** 2026-06-30

---

## The Customer Journey

```
1. Inquiry ──→ 2. Assessment ──→ 3. Quotation ──→ 4. Installation
                                                      │
                                              5. Tuning ──→ 6. Validation ──→ 7. Handover
                                                                                  │
                                                                          8. Follow-up
```

### 1. Inquiry

Customer contacts workshop about engine management upgrade.

- Capture vehicle details: make, model, year, engine
- Capture customer goals: power, drivability, track use, emissions
- Check vehicle support matrix

### 2. Assessment

- Verify ECU compatibility with vehicle
- Identify required sensors, connectors, and accessories
- Estimate labor hours
- Check if custom calibration is needed or existing base map available

### 3. Quotation

- ECU hardware: $XXX
- Harness/adapter: $XXX
- Installation labor: $XXX
- Tuning/calibration: $XXX
- Total estimate provided to customer

### 4. Installation

- Follow installation guide
- Verify all connections
- Power-on test
- Base configuration via Studio

### 5. Tuning

- Initial startup and idle tuning
- Part-throttle drivability tuning
- Full-throttle performance tuning
- Data logging and analysis
- Knock detection verification

### 6. Validation

- Road test with datalogging
- Verify AFR, temperatures, and all systems
- Check for fault codes
- Fine-tune as needed

### 7. Handover

- Demonstrate mobile app (if cloud-connected)
- Provide quick reference card
- Schedule follow-up appointment
- Collect payment

### 8. Follow-up

- 1-week check-in (phone or email)
- 1-month review (datalog check)
- Offer cloud subscription for remote monitoring
- Schedule annual service

## Customer Communication Templates

### Initial Quote Email
```
Subject: Quote for {vehicle} — {customer_name}

Dear {customer_name},

Thank you for your inquiry about {vehicle}.

We recommend:
- {ECU model}: ${price}
- {Optional: harness, sensors, etc.}
- Labor: {hours} hours

Total estimate: ${total}

We have availability on {date}. Please let us know if you'd like to proceed.

Best regards,
{workshop_name}
```

### Post-Installation Follow-Up
```
Subject: {vehicle} — 1-week check-in

Hi {customer_name},

How is {vehicle} running since the ECU installation?

If you have any questions or notice anything unusual, please don't hesitate to reach out.

We recommend bringing the car back in 1 month for a free datalog review.

Best regards,
{workshop_name}
```
