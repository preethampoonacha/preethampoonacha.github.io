import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DSA_THEMES, ThemeDefinition, DsaTopic, AlgorithmPattern } from './dsa-themes.data';

@Component({
  selector: 'app-dsa-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dsa-roadmap.component.html',
  styleUrls: ['./dsa-roadmap.component.css']
})
export class DsaRoadmapComponent implements OnInit {
  themes: ThemeDefinition[] = DSA_THEMES;
  selectedTheme: ThemeDefinition = this.themes[0];
  selectedTopic!: DsaTopic;
  selectedPattern: AlgorithmPattern | null = null;

  ngOnInit() {
    this.initThemeState();
  }

  selectTheme(theme: ThemeDefinition) {
    this.selectedTheme = theme;
    this.initThemeState();
  }

  private initThemeState() {
    this.selectedTopic = this.selectedTheme.topics[0];
    this.selectedPattern = this.selectedTopic.patterns && this.selectedTopic.patterns.length > 0 
      ? this.selectedTopic.patterns[0] 
      : null;
  }

  selectTopic(topic: DsaTopic) {
    this.selectedTopic = topic;
    this.selectedPattern = topic.patterns && topic.patterns.length > 0 
      ? topic.patterns[0] 
      : null;
  }

  selectPattern(pattern: AlgorithmPattern) {
    this.selectedPattern = pattern;
  }
}
