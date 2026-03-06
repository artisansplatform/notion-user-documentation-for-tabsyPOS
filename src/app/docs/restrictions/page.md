# Sales Transactions

## Restrictions



To prevent incorrect actions, the system applies several safeguards when voiding a sale:

- **Prevent double voiding:** A sale that has already been voided cannot be voided again.
- **Block voiding if returns exist:** If a return has already been processed for a sale, the system will prevent that sale from being voided.
- **Prevent returns on voided sales:** Once a sale has been voided, no return transactions can be created for that sale.

### Inventory Handling


When a sale is voided, the system automatically restores inventory levels.

- **Restore stock:** All items from the voided sale are returned to inventory.
- **Inventory update history:** The stock adjustments created by the void action are recorded in the **inventory update history** for traceability.

### Sales Statistics Impact


Voided sales are excluded from sales totals to ensure accurate reporting.

- Sales statistics and reports are automatically updated to reflect the voided transaction.
- The voided sale will no longer contribute to **sales totals or revenue calculations**.

### Void Receipt


After voiding a sale, you can **print a void receipt**. This receipt clearly indicates that the transaction has been voided and includes:

- Original sale reference
- Date and time of the void action
- Items from the original transaction
- Total amount of the voided sale

This receipt can be kept for **audit or record-keeping purposes**.


---


