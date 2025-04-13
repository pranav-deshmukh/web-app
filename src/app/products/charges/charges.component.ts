/** Angular Imports */
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';

/** rxjs Imports */
import { of } from 'rxjs';

/** Custom Services */
import { PopoverService } from '../../configuration-wizard/popover/popover.service';
import { ConfigurationWizardService } from '../../configuration-wizard/configuration-wizard.service';
import { Charges } from 'app/core/utils/charges';
import { OptionData } from 'app/shared/models/option-data.model';
import { Charge } from './models/charge.model';

/**
 * Charges component.
 */
@Component({
  selector: 'mifosx-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit, AfterViewInit {
  /** Charge data. */
  chargeData: Charge[] = [];
  /** Columns to be displayed in charges table. */
  displayedColumns: string[] = [
    'name',
    'chargeAppliesTo',
    'chargeTimeType',
    'chargeCalculationType',
    'amount',
    'penalty',
    'active'
  ];
  /** Data source for charges table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for charges table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for charges table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* Reference of create charges button */
  @ViewChild('buttonCreateCharge') buttonCreateCharge: ElementRef<any>;
  /* Template for popover on create charges button */
  @ViewChild('templateButtonCreateCharge') templateButtonCreateCharge: TemplateRef<any>;
  /* Reference of charges table */
  @ViewChild('chargesTable') chargesTable: ElementRef<any>;
  /* Template for popover on charges table */
  @ViewChild('templateChargesTable') templateChargesTable: TemplateRef<any>;

  chargeAppliesToOptions: OptionData[] = [];

  /**
   * Retrieves the charges data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router.
   * @param {ConfigurationWizardService} configurationWizardService ConfigurationWizard Service.
   * @param {PopoverService} popoverService PopoverService.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configurationWizardService: ConfigurationWizardService,
    private popoverService: PopoverService,
    private charges: Charges
  ) {
    this.route.data.subscribe((data: { charges: any }) => {
      this.chargeData = data.charges;
    });
    this.chargeAppliesToOptions = this.charges.getChargeAppliesToOptions();
  }

  /**
   * Filters data in charges table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets the charges table.
   */
  ngOnInit() {
    this.setCharges();
  }

  /**
   * Initializes the data source, paginator and sorter for charges table.
   */
  setCharges() {
    this.dataSource = new MatTableDataSource(this.chargeData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (charge: any, property: any) => {
      switch (property) {
        case 'chargeAppliesTo':
          return charge.chargeAppliesTo.value;
        default:
          return charge[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  /**
   * To show popover.
   */
  ngAfterViewInit() {
    if (this.configurationWizardService.showChargesPage === true) {
      setTimeout(() => {
        this.showPopover(this.templateButtonCreateCharge, this.buttonCreateCharge.nativeElement, 'bottom', true);
      });
    }

    if (this.configurationWizardService.showChargesList === true) {
      setTimeout(() => {
        this.showPopover(this.templateChargesTable, this.chargesTable.nativeElement, 'top', true);
      });
    }
  }

  /**
   * Popover function
   * @param template TemplateRef<any>.
   * @param target HTMLElement | ElementRef<any>.
   * @param position String.
   * @param backdrop Boolean.
   */
  showPopover(
    template: TemplateRef<any>,
    target: HTMLElement | ElementRef<any>,
    position: string,
    backdrop: boolean
  ): void {
    setTimeout(() => this.popoverService.open(template, target, position, backdrop, {}), 200);
  }

  /**
   * Next Step (Loan Products - Products Page) Configuration Wizard.
   */
  nextStep() {
    this.configurationWizardService.showChargesPage = false;
    this.configurationWizardService.showChargesList = false;
    this.configurationWizardService.showLoanProducts = true;
    this.router.navigate(['/products']);
  }

  /**
   * Previous Step (Charges - Products Page) Configuration Wizard.
   */
  previousStep() {
    this.configurationWizardService.showChargesPage = false;
    this.configurationWizardService.showChargesList = false;
    this.configurationWizardService.showCharges = true;
    this.router.navigate(['/products']);
  }

  filterByAppliesTo(chargeAppliesTo: number) {
    const filteredCharges: Charge[] = this.chargeData.filter((charge: Charge) => {
      return charge.chargeAppliesTo.id === chargeAppliesTo;
    });
    this.dataSource = new MatTableDataSource(filteredCharges);
  }
}
