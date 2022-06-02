import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateDto } from 'src/app/api/templating/template-dto';
import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';

@Component({
  selector: 'app-configurations-detail',
  templateUrl: './configurations-detail.component.html',
  styleUrls: ['./configurations-detail.component.scss']
})
export class ConfigurationsDetailComponent implements OnInit {
  templateDto: TemplateDto;
  templateId: string;
  routerLinkUrl = '/configuration/list';

  constructor(private activatedRoute: ActivatedRoute, private templatingService: TemplatingService, private elRef: ElementRef) {
    this.activatedRoute.params.subscribe((params) => {
      this.templateId = params.templateId;
    });
  }

  ngOnInit(): void {
    this.templatingService.getTemplateDetail(this.templateId).subscribe((templateDto) => {
      this.templateDto = templateDto;
    });
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }
}
